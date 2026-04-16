"use client";

import { Sparkles, X } from "lucide-react";

type AdvancedFiltersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  stockFilter: "all" | "in" | "out";
  onStockFilterChange: (value: "all" | "in" | "out") => void;
  maxPrice: number;
  onMaxPriceChange: (value: number) => void;
  onlyDiscounted: boolean;
  onOnlyDiscountedChange: (value: boolean) => void;
  sortBy: "popular" | "new" | "priceAsc" | "priceDesc";
  onSortByChange: (value: "popular" | "new" | "priceAsc" | "priceDesc") => void;
};

export function AdvancedFiltersModal({
  isOpen,
  onClose,
  stockFilter,
  onStockFilterChange,
  maxPrice,
  onMaxPriceChange,
  onlyDiscounted,
  onOnlyDiscountedChange,
  sortBy,
  onSortByChange,
}: AdvancedFiltersModalProps) {
  if (!isOpen) {
    return null;
  }

  const minValue = 30;
  const maxValue = 400;
  const sliderPercent = ((maxPrice - minValue) / (maxValue - minValue)) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 backdrop-blur-sm md:items-center">
      <div className="dashboard-reveal w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white/95 p-5 shadow-[0_30px_80px_rgba(2,6,23,0.35)]">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.17em] text-zinc-500">Ətraflı filtr paneli</p>
            <h3 className="text-2xl font-semibold text-zinc-800">Ağıllı seçimlər</h3>
          </div>
          <button
            className="inline-flex size-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition hover:text-zinc-900"
            onClick={onClose}
          >
            <X className="size-4" />
          </button>
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Stok vəziyyəti</p>
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em]">
            <button
              className={`rounded-full px-3 py-1.5 transition ${
                stockFilter === "all"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 bg-white text-zinc-600"
              }`}
              onClick={() => onStockFilterChange("all")}
            >
              Hamısı
            </button>
            <button
              className={`rounded-full px-3 py-1.5 transition ${
                stockFilter === "in"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 bg-white text-zinc-600"
              }`}
              onClick={() => onStockFilterChange("in")}
            >
              Stokda olanlar
            </button>
            <button
              className={`rounded-full px-3 py-1.5 transition ${
                stockFilter === "out"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 bg-white text-zinc-600"
              }`}
              onClick={() => onStockFilterChange("out")}
            >
              Stokda olmayanlar
            </button>
          </div>
        </section>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Sıralama</p>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold uppercase tracking-[0.14em]">
              <button
                className={`rounded-xl px-3 py-2 transition ${
                  sortBy === "popular"
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-300 bg-white text-zinc-600"
                }`}
                onClick={() => onSortByChange("popular")}
              >
                Populyar
              </button>
              <button
                className={`rounded-xl px-3 py-2 transition ${
                  sortBy === "new"
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-300 bg-white text-zinc-600"
                }`}
                onClick={() => onSortByChange("new")}
              >
                Yenilər
              </button>
              <button
                className={`rounded-xl px-3 py-2 transition ${
                  sortBy === "priceAsc"
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-300 bg-white text-zinc-600"
                }`}
                onClick={() => onSortByChange("priceAsc")}
              >
                Qiymət artan
              </button>
              <button
                className={`rounded-xl px-3 py-2 transition ${
                  sortBy === "priceDesc"
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-300 bg-white text-zinc-600"
                }`}
                onClick={() => onSortByChange("priceDesc")}
              >
                Qiymət azalan
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Xüsusi seçimlər</p>
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700">
              Yalnız endirimli məhsullar
              <span
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  onlyDiscounted ? "bg-[#d51414]" : "bg-zinc-300"
                }`}
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={onlyDiscounted}
                  onChange={(event) => onOnlyDiscountedChange(event.target.checked)}
                />
                <span
                  className={`absolute left-0.5 size-5 rounded-full bg-white shadow transition-transform ${
                    onlyDiscounted ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </span>
            </label>

            <p className="mt-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-500">
              Filtrlər real vaxtda məhsul kartlarına tətbiq olunur.
            </p>
          </section>
        </div>

        <section className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <p className="font-semibold text-zinc-700">Maksimum qiymət</p>
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">
              {maxPrice} ₼
            </span>
          </div>

          <div className="relative px-0.5">
            <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
              <span>30 ₼</span>
              <span>400 ₼</span>
            </div>

          <input
            className="premium-range w-full"
            type="range"
            min={30}
            max={400}
            step={5}
            value={maxPrice}
            style={{
              background: `linear-gradient(to right, #111827 0%, #111827 ${sliderPercent}%, #d4d4d8 ${sliderPercent}%, #d4d4d8 100%)`,
            }}
            onChange={(event) => onMaxPriceChange(Number(event.target.value))}
          />

            <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-zinc-500">
              <span>Ekonom</span>
              <span>Orta</span>
              <span>Premium</span>
            </div>
          </div>
        </section>

        <footer className="mt-4 flex items-center justify-between rounded-2xl border border-zinc-200 bg-gradient-to-r from-zinc-900 to-zinc-800 px-4 py-3 text-white">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="size-4" />
            Filtrlər tətbiq olundu
          </div>
          <button
            className="rounded-xl bg-[#d51414] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#b91111]"
            onClick={onClose}
          >
            Hazırdır
          </button>
        </footer>
      </div>
    </div>
  );
}
