"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  BadgePercent,
  CircleGauge,
  Check,
  ChevronDown,
  Disc3,
  Droplet,
  Filter,
  Flame,
  Snowflake,
  Tag,
  Wrench,
} from "lucide-react";
import type { Category } from "@/types/catalog";

const iconMap = {
  droplet: Droplet,
  snowflake: Snowflake,
  disc: Disc3,
  filter: Filter,
  engine: CircleGauge,
  suspension: Wrench,
} as const;

type CategorySidebarProps = {
  categories: Category[];
  activeCategoryId: string;
  selectedItem: string | null;
  onSelectCategory: (categoryId: string) => void;
  onSelectItem: (item: string | null) => void;
  stockFilter: "all" | "in" | "out";
  onStockFilterChange: (value: "all" | "in" | "out") => void;
  pricePreset: "all" | "economy" | "mid" | "premium";
  onPricePresetChange: (value: "all" | "economy" | "mid" | "premium") => void;
  onlyDiscounted: boolean;
  onOnlyDiscountedChange: (value: boolean) => void;
  sortBy: "popular" | "new" | "priceAsc" | "priceDesc";
  onSortByChange: (value: "popular" | "new" | "priceAsc" | "priceDesc") => void;
  onResetFilters: () => void;
  categoryCounts: Record<string, number>;
  itemCounts: Record<string, number>;
};

export function CategorySidebar({
  categories,
  activeCategoryId,
  selectedItem,
  onSelectCategory,
  onSelectItem,
  stockFilter,
  onStockFilterChange,
  pricePreset,
  onPricePresetChange,
  onlyDiscounted,
  onOnlyDiscountedChange,
  sortBy,
  onSortByChange,
  onResetFilters,
  categoryCounts,
  itemCounts,
}: CategorySidebarProps) {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setOpenCategoryId((previous) => (previous === categoryId ? null : categoryId));
  };

  const filtersPanel = (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
          Filtrlər
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
            onClick={onResetFilters}
          >
            Sıfırla
          </button>
          <button
            type="button"
            className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
            onClick={() => setShowFilters(false)}
          >
            Bağla
          </button>
        </div>
      </div>
      <section className="mb-4 border-b border-zinc-200 pb-4">
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500 mb-2">Stok vəziyyəti</p>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              stockFilter === "all"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600"
            }`}
            onClick={() => onStockFilterChange("all")}
          >
            <CircleGauge className="size-3" />
            Hamısı
          </button>
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              stockFilter === "in"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600"
            }`}
            onClick={() => onStockFilterChange("in")}
          >
            <CircleGauge className="size-3" />
            Stokda var
          </button>
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              stockFilter === "out"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600"
            }`}
            onClick={() => onStockFilterChange("out")}
          >
            <CircleGauge className="size-3" />
            Stokda yoxdur
          </button>
        </div>
      </section>
      <section className="mb-4 border-b border-zinc-200 pb-4">
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500 mb-2">Qiymət aralığı</p>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              pricePreset === "all"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600"
            }`}
            onClick={() => onPricePresetChange("all")}
          >
            <Tag className="size-3" />
            Bütün qiymətlər
          </button>
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              pricePreset === "economy"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600"
            }`}
            onClick={() => onPricePresetChange("economy")}
          >
            <Tag className="size-3" />
            Ekonom
          </button>
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              pricePreset === "mid"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600"
            }`}
            onClick={() => onPricePresetChange("mid")}
          >
            <Tag className="size-3" />
            Orta
          </button>
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              pricePreset === "premium"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600"
            }`}
            onClick={() => onPricePresetChange("premium")}
          >
            <Tag className="size-3" />
            Premium
          </button>
        </div>
      </section>
      <section className="mb-4 border-b border-zinc-200 pb-4">
        <button
          type="button"
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
            onlyDiscounted
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-zinc-200 bg-white text-zinc-700"
          }`}
          onClick={() => onOnlyDiscountedChange(!onlyDiscounted)}
        >
          <BadgePercent className="size-4" />
          Yalnız endirimli məhsullar
        </button>
      </section>
      <section className="mb-2">
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500 mb-2">Sıralama</p>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              sortBy === "popular"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600"
            }`}
            onClick={() => onSortByChange("popular")}
          >
            <ArrowUpDown className="size-3" />
            Populyar
          </button>
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              sortBy === "new"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600"
            }`}
            onClick={() => onSortByChange("new")}
          >
            <ArrowUpDown className="size-3" />
            Yeni stok
          </button>
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              sortBy === "priceAsc"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600"
            }`}
            onClick={() => onSortByChange("priceAsc")}
          >
            <ArrowUpDown className="size-3" />
            Ucuzdan bahaya
          </button>
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              sortBy === "priceDesc"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600"
            }`}
            onClick={() => onSortByChange("priceDesc")}
          >
            <ArrowUpDown className="size-3" />
            Bahadan ucuza
          </button>
        </div>
      </section>
    </div>
  );

  return (
    <aside className="dashboard-reveal rounded-[24px] bg-white p-4 shadow-[0_14px_34px_rgba(24,24,27,0.08)] md:p-5 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-auto">
      <div className="flex items-center justify-between mb-5 gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Alış-veriş bölmələri</p>
          <h2 className="mt-1 text-lg font-semibold text-zinc-900">Kateqoriyalar</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 md:hidden"
            onClick={() => setShowCategories((value) => !value)}
            aria-expanded={showCategories}
          >
            <ChevronDown className={`size-4 transition-transform ${showCategories ? "rotate-180" : "rotate-0"}`} />
            Menyu
          </button>
          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              showFilters
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
            }`}
            onClick={() => setShowFilters((v) => !v)}
          >
            <Filter className="size-4" />
            Filtrlər
          </button>
        </div>
      </div>

      {showFilters ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_10px_22px_rgba(24,24,27,0.06)]">
          {filtersPanel}
        </div>
      ) : null}

      <div
        className={`overflow-hidden transition-all duration-300 ease-out md:overflow-visible ${
          showCategories ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
        } md:max-h-none md:opacity-100 ${showFilters ? "mt-4" : ""}`}
      >
        <div className="space-y-1.5">
          {categories.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap] ?? Flame;
            const isOpen = openCategoryId === category.id;
            const isCategoryActive = activeCategoryId === category.id;
            const categoryCount = categoryCounts[category.id] ?? 0;

            return (
              <section
                key={category.id}
                className={`rounded-2xl p-2 transition ${
                  isCategoryActive ? "bg-zinc-100" : "bg-transparent"
                }`}
              >
                <button
                  type="button"
                  className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-xl px-2 transition ${
                    isOpen ? "mb-2" : "mb-0"
                  } ${
                    isCategoryActive
                      ? "bg-white text-zinc-900 shadow-[0_4px_14px_rgba(24,24,27,0.08)]"
                      : "bg-transparent text-zinc-700 hover:bg-zinc-100"
                  }`}
                  onClick={() => {
                    const shouldClose = isOpen && openCategoryId === category.id;
                    if (shouldClose) {
                      setOpenCategoryId(null);
                      return;
                    }

                    toggleCategory(category.id);
                  }}
                  aria-expanded={isOpen}
                >
                  <h3 className="flex items-center gap-2 text-base font-medium">
                    <Icon className={`size-4 ${isCategoryActive ? "text-red-500" : "text-zinc-500"}`} />
                    <span>{category.title}</span>
                  </h3>
                  <div className="flex min-w-[68px] items-center justify-end gap-1.5">
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-100 px-1.5 text-[10px] font-semibold leading-none text-red-600">
                      {String(categoryCount).padStart(2, "0")}
                    </span>
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-zinc-200/70">
                      <ChevronDown
                        className={`size-3.5 text-zinc-500 transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                      />
                    </span>
                  </div>
                </button>
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out will-change-[grid-template-rows,opacity] ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                >
                  <ul className="space-y-2 overflow-hidden">
                    {category.items.map((item) => (
                      <li key={item}>
                        {(() => {
                          const itemKey = `${category.id}::${item}`;
                          const isItemActive =
                            activeCategoryId === category.id && selectedItem === item;
                          const itemCount = itemCounts[itemKey] ?? 0;

                          return (
                            <button
                              type="button"
                              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                                isItemActive
                                  ? "bg-zinc-900 text-white shadow-[0_6px_14px_rgba(24,24,27,0.2)]"
                                  : "bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                              }`}
                              onClick={() => {
                                if (isItemActive) {
                                  onSelectItem(null);
                                  onSelectCategory("all");
                                  return;
                                }

                                onSelectItem(item);
                                onSelectCategory(category.id);
                                setOpenCategoryId(category.id);
                              }}
                              aria-pressed={isItemActive}
                            >
                              {item}
                              <span className="inline-flex items-center gap-1 text-xs">
                                {isItemActive ? <Check className="size-3" /> : null}
                                {String(itemCount).padStart(2, "0")}
                              </span>
                            </button>
                          );
                        })()}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
        <section className="mt-4 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 p-3 text-white">
          <p className="text-xs uppercase tracking-[0.15em] text-zinc-300">Premium dəstək</p>
          <p className="mt-1 text-sm font-semibold subtle-float">
            Canlı konsultasiya ilə doğru hissəni tapın
          </p>
          <a
            href="tel:+994503919290"
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-[#d51414] px-4 py-2 text-sm font-semibold leading-none text-white transition hover:bg-[#b91111]"
          >
            Mütəxəssisə yaz
          </a>
        </section>
      </div>
    </aside>
  );
}
