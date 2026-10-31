import { cn } from "../utils/cn";
import type { AppraisalItem } from "../data/items";
import type { AppraisalResult } from "../lib/appraise";
import { useAnimatedNumber } from "../hooks/useAnimatedNumber";

type Props = {
  item: AppraisalItem;
  result: AppraisalResult;
  onReset: () => void;
  dirty: boolean;
};

function sign(n: number) {
  return n > 0 ? `+${n}` : `${n}`;
}

export function PriceBar({ item, result, onReset, dirty }: Props) {
  const animated = useAnimatedNumber(result.finalPrice);
  const progress = Math.round((result.selectedCount / result.totalCount) * 100);

  return (
    <div className="sticky bottom-0 z-20 border-t border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        {/* breakdown */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-white/5 px-2 py-1 font-mono text-[11px] text-slate-400">
              基础 {item.basePrice}
            </span>
            {result.lines.map((line) => (
              <span
                key={line.key}
                className={cn(
                  "rounded-md px-2 py-1 font-mono text-[11px] tabular-nums",
                  line.amount > 0
                    ? "bg-emerald-400/10 text-emerald-300"
                    : line.amount < 0
                      ? "bg-rose-400/10 text-rose-300"
                      : "bg-white/5 text-slate-400",
                )}
              >
                {line.detail} {sign(line.amount)}
              </span>
            ))}
            {result.lines.length === 0 && (
              <span className="text-[11px] text-slate-600">尚未选择任何检查点选项</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-500">
              检查点 {result.selectedCount}/{result.totalCount}
              {result.isComplete ? " · 已完成" : " · 进行中"}
            </span>
          </div>
        </div>

        {/* price + reset */}
        <div className="flex items-end justify-between gap-5 lg:justify-end">
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">最终估价</p>
              {result.isFloored && (
                <span className="rounded bg-amber-400/15 px-1.5 py-px text-[10px] font-medium text-amber-300">
                  保底价
                </span>
              )}
            </div>
            <div className="flex items-baseline justify-end gap-2">
              {result.isFloored && (
                <span className="font-mono text-sm text-slate-600 line-through tabular-nums">
                  {item.currency}
                  {result.rawTotal}
                </span>
              )}
              <span
                className={cn(
                  "bg-gradient-to-br bg-clip-text font-mono text-4xl font-bold tabular-nums text-transparent sm:text-5xl",
                  result.isFloored
                    ? "from-amber-200 to-amber-400"
                    : "from-white via-cyan-100 to-cyan-300",
                )}
              >
                {item.currency}
                {animated}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-600">
              最低价 {item.currency}
              {item.floorPrice} · 基础价 {item.currency}
              {item.basePrice}
            </p>
          </div>

          <button
            onClick={onReset}
            disabled={!dirty}
            className={cn(
              "group flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
              dirty
                ? "border-white/15 bg-white/5 text-slate-200 hover:border-rose-400/50 hover:bg-rose-400/10 hover:text-rose-200 active:scale-95"
                : "cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-600",
            )}
          >
            <svg
              className={cn("h-4 w-4 transition-transform duration-500", dirty && "group-hover:-rotate-180")}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            重置
          </button>
        </div>
      </div>
    </div>
  );
}
