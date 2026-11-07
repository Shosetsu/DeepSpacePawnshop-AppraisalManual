import { cn } from "../utils/cn";
import { formatDelta } from "../utils/formatDelta";
import type { Checkpoint, SelectionValue } from "../data/items";

export type CheckpointCardProps = {
  index: number;
  checkpoint: Checkpoint;
  value?: SelectionValue;
  onChange: (checkpointId: string, optionId: string) => void;
};

export function CheckpointCard({
  index,
  checkpoint,
  value,
  onChange,
}: CheckpointCardProps) {
  const selectedIds = Array.isArray(value)
    ? value
    : typeof value === "string" && value
      ? [value]
      : [];
  const selectedOptions = checkpoint.options.filter((o) =>
    selectedIds.includes(o.id),
  );
  const hasSelection = selectedOptions.length > 0;
  const isCounterfeit = selectedOptions.some((o) => o.counterfeitReason);
  const totalDelta = selectedOptions.reduce((acc, cur) => acc + cur.delta, 0);

  return (
    <section
      className={cn(
        "rounded-2xl border bg-slate-900/50 p-4 backdrop-blur transition-colors duration-300 sm:p-5",
        hasSelection
          ? isCounterfeit
            ? "border-rose-500/40"
            : "border-cyan-400/25"
          : "border-white/10",
      )}
    >
      <header className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
            hasSelection
              ? isCounterfeit
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
          <p className="truncate text-xs text-slate-500">
            {checkpoint.caption}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 font-mono text-xs tabular-nums transition-colors",
            !hasSelection
              ? "bg-white/5 text-slate-500"
              : isCounterfeit
                ? "bg-rose-500/15 text-rose-300 font-semibold"
                : totalDelta > 0
                  ? "bg-emerald-400/10 text-emerald-300"
                  : totalDelta < 0
                    ? "bg-rose-400/10 text-rose-300"
                    : "bg-slate-400/10 text-slate-300",
          )}
        >
          {hasSelection
            ? isCounterfeit
              ? "判定赝品"
              : formatDelta(totalDelta)
            : checkpoint.optional
              ? "可选未选"
              : "未选择"}
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
                  ? option.counterfeitReason
                    ? "border-rose-500/60 bg-gradient-to-br from-rose-500/15 to-rose-500/5 shadow-[0_8px_24px_-12px_rgba(244,63,94,0.8)]"
                    : "border-cyan-400/60 bg-gradient-to-br from-cyan-400/15 to-blue-500/5 shadow-[0_8px_24px_-12px_rgba(34,211,238,0.8)]"
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
                  <span
                    className={cn(
                      "text-sm font-medium truncate",
                      active ? "text-white" : "text-slate-300",
                    )}
                  >
                    {option.label}
                  </span>
                </div>
                <span
                  className={cn(
                    "font-mono text-xs font-semibold tabular-nums",
                    option.counterfeitReason
                      ? "text-rose-400"
                      : option.delta > 0
                        ? "text-emerald-400"
                        : option.delta < 0
                          ? "text-rose-400"
                          : "text-slate-500",
                  )}
                >
                  {option.counterfeitReason
                    ? "赝品"
                    : formatDelta(option.delta)}
                </span>
              </div>
              {option.note && (
                <p className="mt-1 text-[11px] text-slate-500 transition-colors group-hover:text-slate-400">
                  {option.note}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
