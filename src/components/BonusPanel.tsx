import { cn } from "../utils/cn";
import type { BonusRule } from "../data/items";

type Props = {
  bonuses: BonusRule[];
  state: Record<string, boolean>;
};

export function BonusPanel({ bonuses, state }: Props) {
  return (
    <section className="rounded-2xl border border-amber-300/20 bg-gradient-to-br from-amber-400/[0.07] to-transparent p-4 sm:p-5">
      <header className="mb-3 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/15 text-sm text-amber-300 ring-1 ring-amber-400/30">
          ★
        </span>
        <div>
          <h3 className="text-[15px] font-semibold text-white">套装加成</h3>
          <p className="text-xs text-slate-500">满足全部条件时自动叠加额外溢价</p>
        </div>
      </header>

      <div className="grid gap-2 sm:grid-cols-2">
        {bonuses.map((rule) => {
          const active = !!state[rule.id];
          return (
            <div
              key={rule.id}
              className={cn(
                "rounded-xl border px-3 py-2.5 transition-all duration-300",
                active
                  ? "border-amber-300/60 bg-amber-400/10 shadow-[0_8px_26px_-14px_rgba(251,191,36,0.9)]"
                  : "border-white/10 bg-white/[0.02]",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      active ? "animate-pulse bg-amber-300" : "bg-slate-600",
                    )}
                  />
                  <span className={cn("text-sm font-medium", active ? "text-amber-100" : "text-slate-400")}>
                    {rule.label}
                  </span>
                </div>
                <span
                  className={cn(
                    "font-mono text-xs tabular-nums",
                    active ? "text-amber-200" : "text-slate-600",
                  )}
                >
                  +{rule.bonus}
                </span>
              </div>
              <p className={cn("mt-1 text-[11px] leading-relaxed", active ? "text-amber-200/70" : "text-slate-600")}>
                {rule.formula}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
