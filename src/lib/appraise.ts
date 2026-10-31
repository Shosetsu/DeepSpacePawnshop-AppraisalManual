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
  isCounterfeit: boolean;
  counterfeitReasons: string[];
  selectedCount: number;
  totalCount: number;
  isComplete: boolean;
};

export const HIGH_QUALITY_FACTORIES = ["01", "02", "05", "08", "21", "34"];
export const LOW_QUALITY_FACTORIES = ["07", "15", "18", "26", "31"];

export type BatchEvaluation = {
  isFilled: boolean;
  isValid: boolean;
  isCounterfeit: boolean;
  batchType?: "batch1" | "batch2";
  delta: number;
  detail: string;
  reason?: string;
};

export function parseBatch(raw?: unknown): { year?: number; month?: number } {
  if (typeof raw !== "string" || !raw.trim()) return {};
  const cleaned = raw.trim();
  const match = cleaned.match(/^(\d{1,4})[^\d]+(\d{1,2})/);
  if (match) {
    return { year: parseInt(match[1], 10), month: parseInt(match[2], 10) };
  }
  return {};
}

export function evaluateRibwichBatch(raw?: unknown): BatchEvaluation {
  if (typeof raw !== "string" || !raw.trim()) {
    return { isFilled: false, isValid: false, isCounterfeit: false, delta: 0, detail: "未输入" };
  }
  const { year, month } = parseBatch(raw);
  if (year === undefined || month === undefined || month < 1 || month > 12) {
    return {
      isFilled: true,
      isValid: false,
      isCounterfeit: true,
      delta: 0,
      detail: `${raw}（格式无效）`,
      reason: "生产批次格式不规范或月份无效（判定为赝品）",
    };
  }

  // 第一批（首月）（425年1月） 价格+130
  if (year === 425 && month === 1) {
    return {
      isFilled: true,
      isValid: true,
      isCounterfeit: false,
      batchType: "batch1",
      delta: 130,
      detail: "第一批（首月：425年1月）",
    };
  }

  // 第一批（首月外）（425年2月~429年12月） 价格+80
  const isBatch1Rest =
    (year === 425 && month >= 2 && month <= 12) ||
    (year >= 426 && year <= 428 && month >= 1 && month <= 12) ||
    (year === 429 && month >= 1 && month <= 12);

  if (isBatch1Rest) {
    return {
      isFilled: true,
      isValid: true,
      isCounterfeit: false,
      batchType: "batch1",
      delta: 80,
      detail: `第一批（${year}年${month}月）`,
    };
  }

  // 第二批（末月）（438年12月） 价格+50
  if (year === 438 && month === 12) {
    return {
      isFilled: true,
      isValid: true,
      isCounterfeit: false,
      batchType: "batch2",
      delta: 50,
      detail: "第二批（末月：438年12月）",
    };
  }

  // 第二批（末月外）（432年1月~438年11月） 价格+0
  const isBatch2Rest =
    (year === 432 && month >= 1 && month <= 12) ||
    (year >= 433 && year <= 437 && month >= 1 && month <= 12) ||
    (year === 438 && month >= 1 && month <= 11);

  if (isBatch2Rest) {
    return {
      isFilled: true,
      isValid: true,
      isCounterfeit: false,
      batchType: "batch2",
      delta: 0,
      detail: `第二批（${year}年${month}月）`,
    };
  }

  // 赝品（其他） 强制最低价格40
  return {
    isFilled: true,
    isValid: true,
    isCounterfeit: true,
    delta: 0,
    detail: `${year}年${month}月（非官方生产周期）`,
    reason: `生产批次（${year}年${month}月）不在官方两期生产窗口内，判定为赝品`,
  };
}

export type FactoryEvaluation = {
  isFilled: boolean;
  isValid: boolean;
  isCounterfeit: boolean;
  delta: number;
  detail: string;
  reason?: string;
};

export function evaluateRibwichFactory(raw?: unknown): FactoryEvaluation {
  if (typeof raw !== "string" || !raw.trim()) {
    return { isFilled: false, isValid: false, isCounterfeit: false, delta: 0, detail: "未输入" };
  }
  const code = raw.trim().padStart(2, "0");
  if (HIGH_QUALITY_FACTORIES.includes(code)) {
    return {
      isFilled: true,
      isValid: true,
      isCounterfeit: false,
      delta: 50,
      detail: `高品质工厂 [${code}]`,
    };
  }
  if (LOW_QUALITY_FACTORIES.includes(code)) {
    return {
      isFilled: true,
      isValid: true,
      isCounterfeit: false,
      delta: -50,
      detail: `低品质工厂 [${code}]`,
    };
  }
  return {
    isFilled: true,
    isValid: true,
    isCounterfeit: true,
    delta: 0,
    detail: `未授权工厂 [${code}]`,
    reason: `工厂代码 [${code}] 未获官方品质认证，判定为赝品`,
  };
}

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
  const counterfeitReasons: string[] = [];

  // 特殊对象判断：肋明治 (ribwich)
  if (item.id === "ribwich") {
    // 1. 生产批次
    const batchVal = selection["batch"];
    const batchEval = evaluateRibwichBatch(batchVal);
    if (batchEval.isFilled) {
      optionTotal += batchEval.delta;
      lines.push({
        key: "batch",
        label: "生产批次",
        detail: batchEval.detail,
        amount: batchEval.delta,
      });
      if (batchEval.isCounterfeit && batchEval.reason) {
        counterfeitReasons.push(batchEval.reason);
      }
    }

    // 2. 包装工厂
    const factoryVal = selection["factory"];
    const factoryEval = evaluateRibwichFactory(factoryVal);
    if (factoryEval.isFilled) {
      optionTotal += factoryEval.delta;
      lines.push({
        key: "factory",
        label: "包装工厂",
        detail: factoryEval.detail,
        amount: factoryEval.delta,
      });
      if (factoryEval.isCounterfeit && factoryEval.reason) {
        counterfeitReasons.push(factoryEval.reason);
      }
    }

    // 3. 豪华配料
    const ingredientVal = selection["ingredients"];
    if (ingredientVal) {
      const pickedIds = Array.isArray(ingredientVal) ? ingredientVal : [ingredientVal];
      const checkpoint = item.checkpoints.find((c) => c.id === "ingredients");
      for (const id of pickedIds) {
        const option = checkpoint?.options.find((o) => o.id === id);
        if (!option) continue;
        optionTotal += option.delta;
        lines.push({
          key: `ingredients-${option.id}`,
          label: "豪华配料",
          detail: option.label,
          amount: option.delta,
        });
      }

      const hasSesame = pickedIds.includes("sesame");
      const hasPickle = pickedIds.includes("pickle");
      if (hasSesame && !hasPickle) {
        counterfeitReasons.push("配料仅有芝麻面包而无酸黄瓜，不符合原厂配方（判定为赝品）");
      } else if (!hasSesame && hasPickle) {
        counterfeitReasons.push("配料仅有酸黄瓜而无芝麻面包，不符合原厂配方（判定为赝品）");
      }
    }

    // 4. 防伪DA标识
    const daLogoVal = selection["da_logo"];
    if (daLogoVal) {
      if (daLogoVal === "invalid") {
        counterfeitReasons.push("防伪DA标识缺失或错误，判定为赝品");
        lines.push({
          key: "da_logo",
          label: "防伪DA标识",
          detail: "无或错误标志",
          amount: 0,
        });
      } else if (daLogoVal === "valid") {
        lines.push({
          key: "da_logo",
          label: "防伪DA标识",
          detail: "官方正品标志",
          amount: 0,
        });
      }
    }

    // 5. Ribwich标识
    const ribwichLogoVal = selection["ribwich_logo"];
    if (ribwichLogoVal) {
      if (batchEval.isFilled && batchEval.isValid && !batchEval.isCounterfeit) {
        if (batchEval.batchType === "batch1") {
          if (ribwichLogoVal === "none") {
            lines.push({
              key: "ribwich_logo",
              label: "Ribwich标识",
              detail: "第一批无标识（核验通过）",
              amount: 0,
            });
          } else {
            counterfeitReasons.push("第一批次包装不应印有Ribwich标识（判定为加贴赝品）");
            lines.push({
              key: "ribwich_logo",
              label: "Ribwich标识",
              detail: "异常有标识",
              amount: 0,
            });
          }
        } else if (batchEval.batchType === "batch2") {
          if (ribwichLogoVal === "has") {
            lines.push({
              key: "ribwich_logo",
              label: "Ribwich标识",
              detail: "第二批印有标识（核验通过）",
              amount: 0,
            });
          } else {
            counterfeitReasons.push("第二批次包装必须印有Ribwich标识（缺失标识为赝品）");
            lines.push({
              key: "ribwich_logo",
              label: "Ribwich标识",
              detail: "异常缺失标识",
              amount: 0,
            });
          }
        }
      } else {
        lines.push({
          key: "ribwich_logo",
          label: "Ribwich标识",
          detail: ribwichLogoVal === "has" ? "有标识" : "无标识",
          amount: 0,
        });
        if (batchEval.isFilled && batchEval.isCounterfeit) {
          counterfeitReasons.push("批次非正规，标识无法与批次对应（判定为赝品）");
        }
      }
    }
  } else {
    // 通用检查点计价
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

  const isCounterfeit = counterfeitReasons.length > 0;
  const rawTotal = item.basePrice + optionTotal + bonusTotal;
  const finalPrice = isCounterfeit ? item.floorPrice : Math.max(item.floorPrice, rawTotal);

  const nonOptionalCheckpoints = item.checkpoints.filter((c) => !c.optional);
  const selectedCount = item.checkpoints.filter((c) => hasSelectedOption(selection[c.id])).length;
  const isComplete = nonOptionalCheckpoints.every((c) => hasSelectedOption(selection[c.id]));

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
