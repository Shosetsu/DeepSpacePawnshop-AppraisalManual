import { useMemo, useState } from "react";
import { items, CheckpointType, type Selection } from "./data/items";
import { appraise, hasSelectedOption } from "./lib/appraise";
import { Sidebar } from "./components/Sidebar";
import { CheckpointCard } from "./components/CheckpointCard";
import { BonusPanel } from "./components/BonusPanel";
import { PriceBar } from "./components/PriceBar";

export default function App() {
  const [activeId, setActiveId] = useState(items[0].id);
  const [selections, setSelections] = useState<Record<string, Selection>>({});

  const activeItem = items.find((i) => i.id === activeId) ?? items[0];
  const selection = selections[activeItem.id] ?? {};

  const result = useMemo(
    () => appraise(activeItem, selection),
    [activeItem, selection],
  );

  const handleChange = (checkpointId: string, optionId: string) => {
    const checkpoint = activeItem.checkpoints.find(
      (c) => c.id === checkpointId,
    );
    setSelections((prev) => {
      const current = prev[activeItem.id] ?? {};
      const next: Selection = { ...current };

      if (
        checkpoint?.type === CheckpointType.Batch ||
        checkpoint?.type === CheckpointType.Factory
      ) {
        if (!optionId || optionId.trim() === "") {
          delete next[checkpointId];
        } else {
          next[checkpointId] = optionId.trim();
        }
      } else if (checkpoint?.multiple) {
        const currentVal = current[checkpointId];
        const currentList: string[] = Array.isArray(currentVal)
          ? currentVal
          : typeof currentVal === "string" && currentVal
            ? [currentVal]
            : [];

        let nextList: string[];
        if (optionId === "none") {
          // 点击“无配件”：如果已选则取消，否则选中无配件并清空其他配件
          if (currentList.includes("none")) {
            nextList = [];
          } else {
            nextList = ["none"];
          }
        } else {
          // 点击具体配件：移除“无配件”，并切换该配件选中状态
          const withoutNone = currentList.filter((id) => id !== "none");
          if (withoutNone.includes(optionId)) {
            nextList = withoutNone.filter((id) => id !== optionId);
          } else {
            nextList = [...withoutNone, optionId];
          }
        }

        if (nextList.length === 0) {
          delete next[checkpointId];
        } else {
          next[checkpointId] = nextList;
        }
      } else {
        // 单选：再次点击同一选项 => 取消选择
        if (next[checkpointId] === optionId) delete next[checkpointId];
        else next[checkpointId] = optionId;
      }

      return { ...prev, [activeItem.id]: next };
    });
  };

  const handleReset = () => {
    setSelections((prev) => ({ ...prev, [activeItem.id]: {} }));
  };

  const dirty = Object.values(selection).some(hasSelectedOption);

  const priceOf = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return null;
    return appraise(item, selections[id] ?? {}).finalPrice;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative flex min-h-screen flex-col lg:flex-row">
        <Sidebar
          items={items}
          activeId={activeItem.id}
          onSelect={setActiveId}
          priceOf={priceOf}
          currency={activeItem.currency}
        />

        <main className="flex min-w-0 flex-1 flex-col lg:h-screen">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
              {/* header */}
              <header className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-3xl ring-1 ring-white/10">
                      {activeItem.icon}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight text-white">
                          {activeItem.name}
                        </h1>
                        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[11px] text-cyan-300">
                          {activeItem.category}
                        </span>
                      </div>
                      <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-400">
                        {activeItem.tagline}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-center">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">
                        基础价
                      </p>
                      <p className="font-mono text-lg font-semibold text-slate-100 tabular-nums">
                        {activeItem.currency}
                        {activeItem.basePrice}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-center">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">
                        最低价
                      </p>
                      <p className="font-mono text-lg font-semibold text-amber-300 tabular-nums">
                        {activeItem.currency}
                        {activeItem.floorPrice}
                      </p>
                    </div>
                  </div>
                </div>
              </header>

              {/* counterfeit alert */}
              {/* {result.isCounterfeit && (
                <div className="mb-6 rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-transparent p-4 sm:p-5 backdrop-blur shadow-[0_8px_30px_-12px_rgba(244,63,94,0.4)]">
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-xl ring-1 ring-rose-500/40">
                      ⚠️
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-rose-200">
                          鉴定结论：判定为赝品
                        </h3>
                        <span className="rounded-full border border-rose-500/40 bg-rose-500/20 px-2 py-0.5 font-mono text-xs font-semibold text-rose-300">
                          强制保底价 {activeItem.currency}{activeItem.floorPrice}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-rose-200/70">
                        该物品未通过原厂防伪或规格核验，已被系统强制执行最低保底估价：
                      </p>
                      <ul className="mt-2 space-y-1 text-xs text-rose-200/90">
                        {result.counterfeitReasons.map((reason, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-rose-400 font-bold">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )} */}

              {/* checklist */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-1">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    估价检查清单
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
                  <span className="text-[11px] text-slate-600">
                    {activeItem.id === "ribwich"
                      ? "支持输入框输入与选项切换 · 赝品直接强制最低价"
                      : "点击已选项可取消选择 · 多选项目支持复选"}
                  </span>
                </div>

                {activeItem.checkpoints.map((checkpoint, index) => (
                  <CheckpointCard
                    key={checkpoint.id}
                    index={index}
                    checkpoint={checkpoint}
                    value={selection[checkpoint.id]}
                    onChange={handleChange}
                  />
                ))}

                <BonusPanel
                  bonuses={activeItem.bonuses}
                  state={result.bonusState}
                />
              </div>

              <p className="mt-6 pb-2 text-center text-[11px] text-slate-600">
                估价公式：基础价 + 各检查点加减项 + 套装加成，结果不低于最低价{" "}
                {activeItem.currency}
                {activeItem.floorPrice}。
              </p>
            </div>
          </div>

          <PriceBar
            item={activeItem}
            result={result}
            onReset={handleReset}
            dirty={dirty}
          />
        </main>
      </div>
    </div>
  );
}
