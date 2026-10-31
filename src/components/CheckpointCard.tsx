import { useState, useEffect } from "react";
import { cn } from "../utils/cn";
import type { Checkpoint, SelectionValue } from "../data/items";
import {
  evaluateRibwichBatch,
  evaluateRibwichFactory,
  parseBatch,
  HIGH_QUALITY_FACTORIES,
  LOW_QUALITY_FACTORIES,
} from "../lib/appraise";

type Props = {
  index: number;
  checkpoint: Checkpoint;
  value?: SelectionValue;
  onChange: (checkpointId: string, optionId: string) => void;
};

function formatDelta(delta: number) {
  if (delta > 0) return `+${delta}`;
  if (delta < 0) return `${delta}`;
  return "±0";
}

export function CheckpointCard({ index, checkpoint, value, onChange }: Props) {
  // 1. 批次输入控件 (checkpoint.type === "batch")
  if (checkpoint.type === "batch") {
    const rawVal = typeof value === "string" ? value : "";
    const parsed = parseBatch(rawVal);
    const [yearInput, setYearInput] = useState(parsed.year ? String(parsed.year) : "");
    const [monthInput, setMonthInput] = useState(parsed.month ? String(parsed.month) : "");

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
              <h3 className="text-[15px] font-semibold text-white">{checkpoint.label}</h3>
              <span className="rounded bg-white/5 px-1.5 py-px font-mono text-[10px] text-slate-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="rounded border border-indigo-400/30 bg-indigo-400/10 px-1.5 py-px text-[10px] text-indigo-300">
                输入框
              </span>
            </div>
            <p className="truncate text-xs text-slate-500">{checkpoint.caption}</p>
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
            {!hasValue ? "未输入" : batchEval.isCounterfeit ? "判定赝品" : formatDelta(batchEval.delta)}
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
              const active = yearInput === preset.year && monthInput === preset.month;
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
                  {preset.label} <span className="opacity-60">({preset.hint})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // 2. 工厂输入控件 (checkpoint.type === "factory")
  if (checkpoint.type === "factory") {
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
              <h3 className="text-[15px] font-semibold text-white">{checkpoint.label}</h3>
              <span className="rounded bg-white/5 px-1.5 py-px font-mono text-[10px] text-slate-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="rounded border border-indigo-400/30 bg-indigo-400/10 px-1.5 py-px text-[10px] text-indigo-300">
                输入框
              </span>
            </div>
            <p className="truncate text-xs text-slate-500">{checkpoint.caption}</p>
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
            {!hasValue ? "未输入" : factoryEval.isCounterfeit ? "判定赝品" : formatDelta(factoryEval.delta)}
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
                      : "border border-rose-400/30 bg-rose-400/10 text-rose-300",
                )}
              >
                {factoryEval.detail}
              </span>
            )}
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-emerald-400/80">高品质 (+50)：</span>
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
              <button
                type="button"
                onClick={() => setFactoryCode("99")}
                className={cn(
                  "cursor-pointer rounded-lg border px-2 py-0.5 font-mono text-xs transition-colors",
                  rawVal.padStart(2, "0") === "99"
                    ? "border-rose-500/60 bg-rose-500/20 text-rose-200"
                    : "border-dashed border-rose-500/30 bg-rose-500/5 text-rose-300/70 hover:border-rose-500/50",
                )}
              >
                99 (赝品测试)
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 3. 通用选项控件 (checkpoint.type === "options" 或默认)
  const selectedIds = Array.isArray(value)
    ? value
    : typeof value === "string" && value
      ? [value]
      : [];
  const selectedOptions = checkpoint.options.filter((o) => selectedIds.includes(o.id));
  const hasSelection = selectedOptions.length > 0;
  const totalDelta = selectedOptions.reduce((acc, cur) => acc + cur.delta, 0);

  return (
    <section
      className={cn(
        "rounded-2xl border bg-slate-900/50 p-4 backdrop-blur transition-colors duration-300 sm:p-5",
        hasSelection ? "border-cyan-400/25" : "border-white/10",
      )}
    >
      <header className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
            hasSelection ? "bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/40" : "bg-white/5 text-slate-400 ring-1 ring-white/10",
          )}
        >
          {checkpoint.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold text-white">{checkpoint.label}</h3>
            <span className="rounded bg-white/5 px-1.5 py-px font-mono text-[10px] text-slate-500">
              {String(index + 1).padStart(2, "0")}
            </span>
            {checkpoint.multiple && (
              <span className="rounded border border-cyan-400/30 bg-cyan-400/10 px-1.5 py-px text-[10px] text-cyan-300">
                多选
              </span>
            )}
            {checkpoint.optional && (
              <span className="rounded border border-amber-400/30 bg-amber-400/10 px-1.5 py-px text-[10px] text-amber-300">
                可选
              </span>
            )}
          </div>
          <p className="truncate text-xs text-slate-500">{checkpoint.caption}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 font-mono text-xs tabular-nums transition-colors",
            !hasSelection
              ? "bg-white/5 text-slate-500"
              : totalDelta > 0
                ? "bg-emerald-400/10 text-emerald-300"
                : totalDelta < 0
                  ? "bg-rose-400/10 text-rose-300"
                  : "bg-slate-400/10 text-slate-300",
          )}
        >
          {hasSelection ? formatDelta(totalDelta) : checkpoint.optional ? "可选未选" : "未选择"}
        </span>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {checkpoint.options.map((option) => {
          const active = selectedIds.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => onChange(checkpoint.id, option.id)}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all duration-200 active:scale-[0.98]",
                active
                  ? "border-cyan-400/60 bg-gradient-to-br from-cyan-400/15 to-blue-500/5 shadow-[0_8px_24px_-12px_rgba(34,211,238,0.8)]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.06]",
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {checkpoint.multiple && (
                    <span
                      className={cn(
                        "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border text-[9px] font-bold transition-colors",
                        active
                          ? "border-cyan-400 bg-cyan-400 text-slate-950"
                          : "border-white/20 bg-white/5 text-transparent",
                      )}
                    >
                      ✓
                    </span>
                  )}
                  <span className={cn("text-sm font-medium truncate", active ? "text-white" : "text-slate-300")}>
                    {option.label}
                  </span>
                </div>
                <span
                  className={cn(
                    "font-mono text-xs tabular-nums shrink-0",
                    option.delta > 0
                      ? active
                        ? "text-emerald-300"
                        : "text-emerald-400/70"
                      : option.delta < 0
                        ? active
                          ? "text-rose-300"
                          : "text-rose-400/70"
                        : "text-slate-500",
                  )}
                >
                  {formatDelta(option.delta)}
                </span>
              </div>
              {option.note && (
                <p className={cn("mt-0.5 truncate text-[11px]", active ? "text-cyan-200/70" : "text-slate-600")}>
                  {option.note}
                </p>
              )}
              {active && <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />}
            </button>
          );
        })}
      </div>
    </section>
  );
}
