import type { AppraisalItem, BonusRule, Selection } from "../data/items";

export type LineItem = {
  key: string;
  label: string;
  detail: string;
  amount: number;
};

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
  selectedCount: number;
  totalCount: number;
  isComplete: boolean;
};

export function hasSelectedOption(val: unknown): boolean {
  if (!val) return false;
  if (Array.isArray(val)) return val.length > 0;
  return typeof val === "string" && val.length > 0;
}

export function isBonusMatched(rule: BonusRule, selection: Selection): boolean {
  return Object.entries(rule.requires).every(([checkpointId, condition]) => {
    const picked = selection[checkpointId];
    if (!picked) return false;

    const pickedList = Array.isArray(picked) ? picked : [picked];
    if (pickedList.length === 0) return false;

    if (Array.isArray(condition)) {
      return pickedList.some((p) => condition.includes(p));
    }

    if (condition.all && condition.all.length > 0) {
      const hasAll = condition.all.every((req) => pickedList.includes(req));
      if (!hasAll) return false;
    }

    if (condition.any && condition.any.length > 0) {
      const hasAny = condition.any.some((req) => pickedList.includes(req));
      if (!hasAny) return false;
    }

    if (condition.exact && condition.exact.length > 0) {
      if (pickedList.length !== condition.exact.length) return false;
      const matchesExact = condition.exact.every((req) => pickedList.includes(req));
      if (!matchesExact) return false;
    }

    return true;
  });
}

export function appraise(item: AppraisalItem, selection: Selection): AppraisalResult {
  const lines: LineItem[] = [];
  let optionTotal = 0;

  for (const checkpoint of item.checkpoints) {
    const picked = selection[checkpoint.id];
    if (!picked) continue;

    const pickedIds = Array.isArray(picked) ? picked : [picked];
    for (const id of pickedIds) {
      const option = checkpoint.options.find((o) => o.id === id);
      if (!option) continue;
      optionTotal += option.delta;
      lines.push({
        key: `${checkpoint.id}-${option.id}`,
        label: checkpoint.label,
        detail: option.label,
        amount: option.delta,
      });
    }
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
        label: "套装加成",
        detail: rule.label,
        amount: rule.bonus,
      });
    }
  }

  const rawTotal = item.basePrice + optionTotal + bonusTotal;
  const finalPrice = Math.max(item.floorPrice, rawTotal);
  const selectedCount = item.checkpoints.filter((c) => hasSelectedOption(selection[c.id])).length;

  return {
    lines,
    matchedBonuses,
    bonusState,
    optionTotal,
    bonusTotal,
    rawTotal,
    finalPrice,
    flooredBy: finalPrice - rawTotal,
    isFloored: rawTotal < item.floorPrice,
    selectedCount,
    totalCount: item.checkpoints.length,
    isComplete: selectedCount === item.checkpoints.length,
  };
}
