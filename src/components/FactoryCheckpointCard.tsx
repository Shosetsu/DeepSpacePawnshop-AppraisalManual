import { cn } from "../utils/cn";
import { formatDelta } from "../utils/formatDelta";
import type { FactoryCheckpoint, SelectionValue } from "../data/items";
import {
  evaluateRibwichFactory,
  HIGH_QUALITY_FACTORIES,
  LOW_QUALITY_FACTORIES,
} from "../lib/appraise";

export type FactoryCheckpointCardProps = {
  index: number;
  checkpoint: FactoryCheckpoint;
  value?: SelectionValue;
  onChange: (checkpointId: string, optionId: string) => void;
};

export function FactoryCheckpointCard({
  index,
  checkpoint,
  value,
  onChange,
}: FactoryCheckpointCardProps) {
  const rawVal = typeof value === "string" ? value : "";
  const factoryEval = evaluateRibwichFactory(rawVal);
  const hasValue = factoryEval.isFilled;

  const setFactoryCode = (code: string) => {
    onChange(checkpoint.id, code);
  };

  return (
    <section
      className={cn(
        "rounded-2xl border bg-slate-900/50 p-4 backdrop-blur transition-colors duration-300 sm:p-5",
        hasValue
          ? factoryEval.isCounterfeit
            ? "border-rose-500/40"
            : "border-cyan-400/25"
          : "border-white/10",
      )}
    >
      <header className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
            hasValue
              ? factoryEval.isCounterfeit
                ? "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40"
                : "bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/40"
              : "bg-white/5 text-slate-400 ring-1 ring-white/10",
          )}
        >
          {checkpoint.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold text-white">
              {checkpoint.label}
            </h3>
            <span className="rounded bg-white/5 px-1.5 py-px font-mono text-[10px] text-slate-500">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="rounded border border-indigo-400/30 bg-indigo-400/10 px-1.5 py-px text-[10px] text-indigo-300">
              输入框
            </span>
          </div>
          <p className="truncate text-xs text-slate-500">
            {checkpoint.caption}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 font-mono text-xs tabular-nums transition-colors",
            !hasValue
              ? "bg-white/5 text-slate-500"
              : factoryEval.isCounterfeit
                ? "bg-rose-500/15 text-rose-300 font-semibold"
                : factoryEval.delta > 0
                  ? "bg-emerald-400/10 text-emerald-300"
                  : factoryEval.delta < 0
                    ? "bg-rose-400/10 text-rose-300"
                    : "bg-slate-400/10 text-slate-300",
          )}
        >
          {!hasValue
            ? "未输入"
            : factoryEval.isCounterfeit
              ? "判定赝品"
              : formatDelta(factoryEval.delta)}
        </span>
      </header>

      {/* 工厂输入框与快速选择 */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">代码：</span>
            <input
              type="text"
              maxLength={4}
              placeholder="如 01, 07"
              value={rawVal}
              onChange={(e) => setFactoryCode(e.target.value)}
              className="w-28 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center font-mono text-sm text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>
          {hasValue && (
            <button
              type="button"
              onClick={() => setFactoryCode("")}
              className="cursor-pointer rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-400 hover:bg-white/[0.08]"
            >
              清除
            </button>
          )}
          {hasValue && (
            <span
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium",
                factoryEval.isCounterfeit
                  ? "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                  : factoryEval.delta > 0
                    ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                    : factoryEval.delta === 0
                      ? "border border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                      : "border border-rose-400/30 bg-rose-400/10 text-rose-300",
              )}
            >
              {factoryEval.detail}
            </span>
          )}
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-emerald-400/80">
              高品质 (+50)：
            </span>
            {HIGH_QUALITY_FACTORIES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setFactoryCode(code)}
                className={cn(
                  "cursor-pointer rounded-lg border px-2 py-0.5 font-mono text-xs transition-colors",
                  rawVal.padStart(2, "0") === code
                    ? "border-emerald-400/60 bg-emerald-400/20 text-emerald-200"
                    : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-emerald-400/30 hover:text-emerald-300",
                )}
              >
                {code}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-rose-400/80">低品质 (-50)：</span>
            {LOW_QUALITY_FACTORIES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setFactoryCode(code)}
                className={cn(
                  "cursor-pointer rounded-lg border px-2 py-0.5 font-mono text-xs transition-colors",
                  rawVal.padStart(2, "0") === code
                    ? "border-rose-400/60 bg-rose-400/20 text-rose-200"
                    : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-rose-400/30 hover:text-rose-300",
                )}
              >
                {code}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-cyan-400/80">普通品质 (0)：</span>
            <button
              type="button"
              onClick={() => setFactoryCode("99")}
              className={cn(
                "cursor-pointer rounded-lg border px-2 py-0.5 font-mono text-xs transition-colors",
                rawVal.padStart(2, "0") === "99"
                  ? "border-cyan-500/60 bg-cyan-500/20 text-cyan-200"
                  : "border-dashed border-cyan-500/30 bg-cyan-500/5 text-cyan-300/70 hover:border-cyan-500/50",
              )}
            >
              99 (其他工厂)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
