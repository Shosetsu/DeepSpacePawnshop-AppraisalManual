import { cn } from "../utils/cn";
import { upcomingItems, type AppraisalItem } from "../data/items";

type Props = {
  items: AppraisalItem[];
  activeId: string;
  onSelect: (id: string) => void;
  priceOf: (id: string) => number | null;
  currency: string;
};

export function Sidebar({ items, activeId, onSelect, priceOf, currency }: Props) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 border-b border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/30">
          <span className="text-lg">⚖</span>
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 ring-2 ring-slate-950" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-wide text-white">义体估价台</p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-300/70">Appraisal Terminal</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="px-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">可估价商品</p>
        <nav className="space-y-2">
          {items.map((item) => {
            const active = item.id === activeId;
            const price = priceOf(item.id);
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={cn(
                  "group relative w-full overflow-hidden rounded-xl border px-3 py-3 text-left transition-all duration-200",
                  active
                    ? "border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(34,211,238,0.15),0_8px_30px_-12px_rgba(34,211,238,0.6)]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]",
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-r bg-cyan-400" />
                )}
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/80 text-lg ring-1 ring-white/10">
                    {item.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate text-sm font-medium", active ? "text-white" : "text-slate-200")}>
                      {item.name}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">{item.category}</p>
                  </div>
                  {price !== null && (
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 font-mono text-[11px] tabular-nums",
                        active ? "bg-cyan-400/15 text-cyan-200" : "bg-white/5 text-slate-400",
                      )}
                    >
                      {currency}
                      {price}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2">
        <p className="px-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-600">即将上线</p>
        <div className="space-y-2 opacity-50">
          {upcomingItems.map((item) => (
            <div
              key={item.id}
              className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-dashed border-white/10 px-3 py-2.5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-base grayscale">
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] text-slate-400">{item.name}</p>
                <p className="truncate text-[10px] text-slate-600">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 lg:block">
        <p className="text-[11px] leading-relaxed text-slate-500">
          所有估价结果仅供参考，最终成交价以验货台复核为准。
        </p>
      </div>
    </aside>
  );
}
