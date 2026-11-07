import type {
  AppraisalItem,
  BonusRule,
  Checkpoint,
  LineItem,
  Selection,
} from '../data/items';

export type AppraisalResult = {
  lines: LineItem[];
  matchedBonuses: BonusRule[];
  bonusState: Record<string, boolean>;
  optionTotal: number;
  bonusTotal: number;
  rawTotal: number;
  finalPrice: number;
  flooredBy: number;
  isFloored: boolean;
  isCounterfeit: boolean;
  counterfeitReasons: string[];
  selectedCount: number;
  totalCount: number;
  isComplete: boolean;
};

export function hasSelectedOption(val: unknown): boolean {
  if (!val) return false;
  if (Array.isArray(val)) return val.length > 0;
  return typeof val === 'string' && val.length > 0;
}

export function isBonusMatched(rule: BonusRule, selection: Selection): boolean {
  return Object.entries(rule.requires).every(([checkpointId, condition]) => {
    const picked = selection[checkpointId];
    const pickedList = !picked ? [] : Array.isArray(picked) ? picked : [picked];

    if (Array.isArray(condition)) {
      if (pickedList.length === 0) return false;
      return pickedList.some((p) => condition.includes(p));
    }

    if (condition.empty) {
      const actualPicked = pickedList.filter((id) => id !== 'none');
      if (actualPicked.length > 0) return false;
    }

    if (condition.noneOf && condition.noneOf.length > 0) {
      const hasForbidden = condition.noneOf.some((req) =>
        pickedList.includes(req),
      );
      if (hasForbidden) return false;
    }

    if (condition.only && condition.only.length > 0) {
      const actualPicked = pickedList.filter((id) => id !== 'none');
      const allAllowed = actualPicked.every((req) =>
        condition.only!.includes(req),
      );
      if (!allAllowed) return false;
    }

    if (condition.all && condition.all.length > 0) {
      if (pickedList.length === 0) return false;
      const hasAll = condition.all.every((req) => pickedList.includes(req));
      if (!hasAll) return false;
    }

    if (condition.any && condition.any.length > 0) {
      if (pickedList.length === 0) return false;
      const hasAny = condition.any.some((req) => pickedList.includes(req));
      if (!hasAny) return false;
    }

    if (condition.exact && condition.exact.length > 0) {
      if (pickedList.length !== condition.exact.length) return false;
      const matchesExact = condition.exact.every((req) =>
        pickedList.includes(req),
      );
      if (!matchesExact) return false;
    }

    return true;
  });
}

function evaluateCheckpoint(
  checkpoint: Checkpoint,
  selection: Selection,
): { lines: LineItem[]; counterfeitReasons: string[] } {
  const evaluation = checkpoint.compute?.(selection);
  if (evaluation?.lines) {
    return {
      lines: evaluation.lines,
      counterfeitReasons: evaluation.counterfeitReasons ?? [],
    };
  }

  const picked = selection[checkpoint.id];
  const pickedIds = !picked ? [] : Array.isArray(picked) ? picked : [picked];
  const lines: LineItem[] = [];
  const counterfeitReasons = [...(evaluation?.counterfeitReasons ?? [])];

  for (const id of pickedIds) {
    const option = checkpoint.options.find((o) => o.id === id);
    if (!option) continue;
    lines.push({
      key: `${checkpoint.id}-${option.id}`,
      label: checkpoint.label,
      detail: option.label,
      amount: option.delta,
    });
    if (option.counterfeitReason) {
      counterfeitReasons.push(option.counterfeitReason);
    }
  }

  return { lines, counterfeitReasons };
}

export function appraise(
  item: AppraisalItem,
  selection: Selection,
): AppraisalResult {
  const lines: LineItem[] = [];
  let optionTotal = 0;
  const counterfeitReasons: string[] = [];

  for (const checkpoint of item.checkpoints) {
    const evaluated = evaluateCheckpoint(checkpoint, selection);
    for (const line of evaluated.lines) {
      optionTotal += line.amount;
      lines.push(line);
    }
    counterfeitReasons.push(...evaluated.counterfeitReasons);
  }

  const bonusState: Record<string, boolean> = {};
  const matchedBonuses: BonusRule[] = [];
  let bonusTotal = 0;

  for (const rule of item.bonuses) {
    const matched = isBonusMatched(rule, selection);
    bonusState[rule.id] = matched;
    if (matched) {
      matchedBonuses.push(rule);
      bonusTotal += rule.bonus;
      lines.push({
        key: `bonus-${rule.id}`,
        label: '套装加成',
        detail: rule.label,
        amount: rule.bonus,
      });
    }
  }

  const isCounterfeit = counterfeitReasons.length > 0;
  const rawTotal = item.basePrice + optionTotal + bonusTotal;
  const finalPrice = isCounterfeit
    ? item.floorPrice
    : Math.max(item.floorPrice, rawTotal);

  const nonOptionalCheckpoints = item.checkpoints.filter((c) => !c.optional);
  const selectedCount = item.checkpoints.filter((c) =>
    hasSelectedOption(selection[c.id]),
  ).length;
  const isComplete = nonOptionalCheckpoints.every((c) =>
    hasSelectedOption(selection[c.id]),
  );

  return {
    lines,
    matchedBonuses,
    bonusState,
    optionTotal,
    bonusTotal,
    rawTotal,
    finalPrice,
    flooredBy: finalPrice - rawTotal,
    isFloored: isCounterfeit || rawTotal < item.floorPrice,
    isCounterfeit,
    counterfeitReasons,
    selectedCount,
    totalCount: item.checkpoints.length,
    isComplete,
  };
}
