import { useState, useEffect } from "react";
import { cn } from "../utils/cn";
import { formatDelta } from "../utils/formatDelta";
import type { BatchCheckpoint, SelectionValue } from "../data/items";
import { evaluateRibwichBatch, parseBatch } from "../lib/appraise";

export type BatchCheckpointCardProps = {
  index: number;
  checkpoint: BatchCheckpoint;
  value?: SelectionValue;
  onChange: (checkpointId: string, optionId: string) => void;
};

export function BatchCheckpointCard({
  index,
  checkpoint,
  value,
  onChange,
}: BatchCheckpointCardProps) {
  const rawVal = typeof value === "string" ? value : "";
  const parsed = parseBatch(rawVal);
  const [yearInput, setYearInput] = useState(
    parsed.year ? String(parsed.year) : "",
  );
  const [monthInput, setMonthInput] = useState(
    parsed.month ? String(parsed.month) : "",
  );

  // 同步外部重置
  useEffect(() => {
    const p = parseBatch(rawVal);
    setYearInput(p.year ? String(p.year) : "");
    setMonthInput(p.month ? String(p.month) : "");
  }, [rawVal]);

  const batchEval = evaluateRibwichBatch(rawVal);
  const hasValue = batchEval.isFilled;

  const updateBatch = (y: string, m: string) => {
    setYearInput(y);
    setMonthInput(m);
    if (!y && !m) {
      onChange(checkpoint.id, "");
    } else if (y && m) {
      onChange(checkpoint.id, `${y}-${m}`);
    }
  };

  const presets = [
    { label: "425年1月 (第一批首月)", year: "425", month: "1", hint: "+130" },
    { label: "427年6月 (第一批)", year: "427", month: "6", hint: "+80" },
    { label: "435年5月 (第二批)", year: "435", month: "5", hint: "±0" },
    { label: "438年12月 (第二批末月)", year: "438", month: "12", hint: "+50" },
    { label: "440年3月 (赝品批次)", year: "440", month: "3", hint: "赝品" },
  ];

  return (
    <section
      className={cn(
        "rounded-2xl border bg-slate-900/50 p-4 backdrop-blur transition-colors duration-300 sm:p-5",
        hasValue
          ? batchEval.isCounterfeit
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
              ? batchEval.isCounterfeit
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
              : batchEval.isCounterfeit
                ? "bg-rose-500/15 text-rose-300 font-semibold"
                : batchEval.delta > 0
                  ? "bg-emerald-400/10 text-emerald-300"
                  : "bg-slate-400/10 text-slate-300",
          )}
        >
          {!hasValue
            ? "未输入"
            : batchEval.isCounterfeit
              ? "判定赝品"
              : formatDelta(batchEval.delta)}
        </span>
      </header>

      {/* 输入框区域 */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="425"
              value={yearInput}
              onChange={(e) => updateBatch(e.target.value, monthInput)}
              className="w-24 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center font-mono text-sm text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
            <span className="text-xs text-slate-400">年</span>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="1"
              min={1}
              max={12}
              value={monthInput}
              onChange={(e) => updateBatch(yearInput, e.target.value)}
              className="w-20 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center font-mono text-sm text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
            <span className="text-xs text-slate-400">月</span>
          </div>
          {hasValue && (
            <button
              type="button"
              onClick={() => updateBatch("", "")}
              className="cursor-pointer rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-400 hover:bg-white/[0.08]"
            >
              清除
            </button>
          )}
          {hasValue && (
            <span
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium",
                batchEval.isCounterfeit
                  ? "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                  : "border border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
              )}
            >
              {batchEval.detail}
            </span>
          )}
        </div>

        {/* 快捷填入标签 */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-500">快捷填充参考：</span>
          {presets.map((preset) => {
            const active =
              yearInput === preset.year && monthInput === preset.month;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => updateBatch(preset.year, preset.month)}
                className={cn(
                  "cursor-pointer rounded-lg border px-2 py-1 text-[11px] transition-colors",
                  active
                    ? "border-cyan-400/60 bg-cyan-400/20 text-cyan-200"
                    : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200",
                )}
              >
                {preset.label}{" "}
                <span className="opacity-60">({preset.hint})</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
