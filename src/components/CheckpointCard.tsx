import { cn } from "../utils/cn";
import type { Checkpoint, SelectionValue } from "../data/items";

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
          {hasSelection ? formatDelta(totalDelta) : "未选择"}
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
                "group relative overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all duration-200 active:scale-[0.98]",
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
