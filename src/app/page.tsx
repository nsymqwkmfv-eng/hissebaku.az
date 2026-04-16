"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdvancedFiltersModal } from "@/components/advanced-filters-modal";
import { BrandHeader } from "@/components/brand-header";
import { CategorySidebar } from "@/components/category-sidebar";
import { OrderRequestSection } from "@/components/order-request-section";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { ServiceHighlights } from "@/components/service-highlights";
import { supabase } from "@/lib/supabaseClient";
import type { Category, Product } from "@/types/catalog";

export default function Home() {
  const brandLogos = [
    "https://framerusercontent.com/images/ZM1bFT8UrjddZnDJbzHMus3IhGo.png?scale-down-to=512",
    "https://framerusercontent.com/images/GYAwkfbC4XA9ltrZpk6vXDzzQ0.png",
    "https://framerusercontent.com/images/KiB6R5VKBBiCETxSf71aQKbFw.png",
    "https://framerusercontent.com/images/pmEgfGxo0HcSqhK0uNdpggEV4U.png?scale-down-to=512",
    "https://framerusercontent.com/images/pAEzTk4J2ZTf9YzHikuCsVYubfM.png?scale-down-to=512",
    "https://framerusercontent.com/images/yqYBV6YQjClOfWKvYoE4Lml5E.png",
  ];
  const [catalogCategories, setCatalogCategories] = useState<Category[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [userSession, setUserSession] = useState<any | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [searchDraft, setSearchDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "out">("all");
  const [pricePreset, setPricePreset] = useState<
    "all" | "economy" | "mid" | "premium"
  >("all");
  const [maxPrice, setMaxPrice] = useState(400);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [sortBy, setSortBy] = useState<
    "popular" | "new" | "priceAsc" | "priceDesc"
  >("popular");
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  const suppressNextUrlSync = useRef(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const loadCatalog = async () => {
      setCatalogLoading(true);
      setCatalogError(null);

      if (!supabase) {
        setCatalogError("Supabase env dəyişənləri tapılmadı.");
        setCatalogLoading(false);
        return;
      }

      const { data: categoryRows, error: categoryError } = await supabase
        .from("categories")
        .select("*");
      const { data: productRows, error: productError } = await supabase
        .from("products")
        .select("*");

      if (!active) {
        return;
      }

      if (categoryError || productError) {
        setCatalogError("Supabase məlumatları yüklənmədi.");
      }

      const nextCategories: Category[] = (categoryRows ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        icon: row.icon ?? "filter",
        items: Array.isArray(row.items) ? row.items : [],
      }));

      const nextProducts: Product[] = (productRows ?? []).map((row) => ({
        id: row.id,
        slug: row.slug,
        categoryId: row.category_id ?? "all",
        title: row.title,
        partType: row.part_type,
        description: row.description,
        images: Array.isArray(row.images) ? row.images : [],
        price: Number(row.price),
        discount: row.discount ?? undefined,
        inStock: row.in_stock,
      }));

      setCatalogCategories(nextCategories);
      setCatalogProducts(nextProducts);
      setCatalogLoading(false);
    };

    loadCatalog();

    if (!supabase) {
      return () => {
        active = false;
      };
    }

    const channel = supabase
      .channel("catalog-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => loadCatalog(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        () => loadCatalog(),
      )
      .subscribe();

    return () => {
      active = false;
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }
      setUserSession(data.session ?? null);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserSession(session);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const filtersParam = new URLSearchParams(window.location.search).get("filters");
    if (!filtersParam) {
      return;
    }

    try {
      const parsed = JSON.parse(decodeURIComponent(filtersParam));
      suppressNextUrlSync.current = true;
      setActiveCategoryId(parsed.activeCategoryId ?? "all");
      setSelectedItem(parsed.selectedItem ?? null);
      setStockFilter(parsed.stockFilter ?? "all");
      setPricePreset(parsed.pricePreset ?? "all");
      setOnlyDiscounted(Boolean(parsed.onlyDiscounted));
      setSortBy(parsed.sortBy ?? "popular");
      setMaxPrice(parsed.maxPrice ?? 400);
      if (typeof parsed.searchQuery === "string") {
        setSearchDraft(parsed.searchQuery);
        setSearchQuery(parsed.searchQuery);
      }
      router.replace("/", { scroll: false });
    } catch {
      router.replace("/", { scroll: false });
    }
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (suppressNextUrlSync.current) {
      suppressNextUrlSync.current = false;
      return;
    }

    const queryValue = new URLSearchParams(window.location.search)
      .get("q")
      ?.trim() ?? "";
    if (queryValue && queryValue !== searchQuery) {
      setSearchDraft(queryValue);
      setSearchQuery(queryValue);
    }
  }, [searchQuery]);

  const handleSaveFilters = async () => {
    if (!supabase || !userSession?.user?.id) {
      setSaveStatus("Filtrləri saxlamaq üçün daxil olun.");
      return;
    }

    const label = window.prompt("Filtri adlandırın", "Seçilmiş filtrlər");
    if (!label) {
      return;
    }

    const payload = {
      activeCategoryId,
      selectedItem,
      stockFilter,
      pricePreset,
      onlyDiscounted,
      sortBy,
      maxPrice,
      searchQuery,
    };

    const { error } = await supabase.from("saved_filters").insert({
      user_id: userSession.user.id,
      label,
      payload,
    });

    if (error) {
      setSaveStatus("Filtr saxlanılmadı.");
      return;
    }

    setSaveStatus("Filtr yadda saxlandı.");
  };

  useEffect(() => {
    if (!catalogProducts.length) {
      return;
    }

    catalogProducts.slice(0, 8).forEach((product) => {
      router.prefetch(`/products/${encodeURIComponent(product.slug ?? product.id)}`);
    });
  }, [catalogProducts, router]);

  const suggestionPool = useMemo(
    () =>
      Array.from(
        new Set([
          ...catalogProducts.map((product) => product.title),
          ...catalogProducts.map((product) => product.partType),
          ...catalogCategories.map((category) => category.title),
        ]),
      ),
    [catalogCategories, catalogProducts],
  );

  const baseFilteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();

    return catalogProducts.filter((product) => {
      if (stockFilter === "in" && !product.inStock) {
        return false;
      }

      if (stockFilter === "out" && product.inStock) {
        return false;
      }

      if (product.price > maxPrice) {
        return false;
      }

      if (pricePreset === "economy" && product.price > 80) {
        return false;
      }

      if (pricePreset === "mid" && (product.price < 81 || product.price > 200)) {
        return false;
      }

      if (pricePreset === "premium" && product.price < 201) {
        return false;
      }

      if (onlyDiscounted && !product.discount) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        product.title.toLowerCase().includes(normalizedQuery) ||
        product.partType.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [
    maxPrice,
    onlyDiscounted,
    pricePreset,
    searchQuery,
    sortBy,
    stockFilter,
    catalogProducts,
  ]);

  const categoryCounts = useMemo(() => {
    return baseFilteredProducts.reduce<Record<string, number>>((accumulator, product) => {
      accumulator[product.categoryId] = (accumulator[product.categoryId] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [baseFilteredProducts]);

  const itemCounts = useMemo(() => {
    const accumulator: Record<string, number> = {};

    catalogCategories.forEach((category) => {
      category.items.forEach((item) => {
        accumulator[`${category.id}::${item}`] = 0;
      });
    });

    baseFilteredProducts.forEach((product) => {
      const category = catalogCategories.find((entry) => entry.id === product.categoryId);
      if (!category) {
        return;
      }
      const productPart = product.partType.toLowerCase();
      const match = category.items.find((item) => item.toLowerCase() === productPart);
      if (!match) {
        return;
      }
      const key = `${category.id}::${match}`;
      accumulator[key] = (accumulator[key] ?? 0) + 1;
    });

    return accumulator;
  }, [baseFilteredProducts, catalogCategories]);

  const filteredProducts = useMemo(() => {
    const normalizedItem = selectedItem?.toLowerCase() ?? "";

    const nextProducts = baseFilteredProducts
      .filter((product) => {
        if (activeCategoryId !== "all" && product.categoryId !== activeCategoryId) {
          return false;
        }

        if (normalizedItem && product.partType.toLowerCase() !== normalizedItem) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "priceAsc") {
          return a.price - b.price;
        }

        if (sortBy === "priceDesc") {
          return b.price - a.price;
        }

        if (sortBy === "new") {
          return b.id.localeCompare(a.id);
        }

        const aScore = (a.discount ?? 0) + (a.inStock ? 3 : 0);
        const bScore = (b.discount ?? 0) + (b.inStock ? 3 : 0);
        return bScore - aScore;
      });

    return nextProducts;
  }, [activeCategoryId, baseFilteredProducts, selectedItem, sortBy]);

  const resetFilters = () => {
    suppressNextUrlSync.current = true;
    setActiveCategoryId("all");
    setSelectedItem(null);
    setStockFilter("all");
    setPricePreset("all");
    setOnlyDiscounted(false);
    setSortBy("popular");
    setMaxPrice(400);
    setSearchDraft("");
    setSearchQuery("");
    router.replace("/");
  };

  const activeCategory = catalogCategories.find((category) => category.id === activeCategoryId);
  const activeSelectionLabel = selectedItem
    ? `${activeCategory?.title ?? ""} · ${selectedItem}`
    : activeCategoryId !== "all"
      ? activeCategory?.title ?? ""
      : "";
  const hasActiveFilters =
    activeCategoryId !== "all" ||
    Boolean(selectedItem) ||
    stockFilter !== "all" ||
    pricePreset !== "all" ||
    onlyDiscounted ||
    sortBy !== "popular" ||
    searchQuery.trim().length > 0;

  return (

    <div className="min-h-screen">
      <BrandHeader
        searchDraft={searchDraft}
        onSearchDraftChange={setSearchDraft}
        onApplySearch={(value) => {
          const nextQuery = (value ?? searchDraft).trim();
          setSearchQuery(nextQuery);
          if (nextQuery) {
            router.replace(`/?q=${encodeURIComponent(nextQuery)}`);
          } else {
            router.replace("/");
          }
        }}
        onClearAll={resetFilters}
        suggestionPool={suggestionPool}
        onOpenAdvancedFilters={() => setIsAdvancedModalOpen(true)}
        resultCount={filteredProducts.length}
      />

      <main className="site-shell flex flex-col gap-6 py-6 lg:grid lg:grid-cols-[300px_1fr] lg:grid-rows-[auto_1fr] lg:gap-8 lg:py-8">
        <section className="order-1 space-y-6 lg:col-start-2 lg:row-start-1">
          <header className="dashboard-reveal overflow-hidden py-1 text-zinc-900">
            <div className="grid gap-6 lg:grid-cols-1 lg:items-center">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d51414]">
                  Hissə Baku
                </p>
                <h1 className="mt-2 text-2xl font-semibold leading-tight md:text-4xl">
                  Orijinal və keyfiyyətli avto hissələri Hissə Baku-da
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-zinc-600">
                  Geniş məhsul seçimi, etibarlı brendlər və peşəkar dəstək ilə
                  avtomobiliniz üçün doğru hissəni rahatlıqla seçin və sifariş edin.
                </p>
                {activeSelectionLabel ? (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d51414]" />
                    {activeSelectionLabel}
                  </div>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600 font-[var(--font-poppins)]">
                  <span>Sürətli çatdırılma</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-400" />
                  <span>Rəsmi zəmanət</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-400" />
                  <span>Canlı dəstək</span>
                </div>
              </div>
            </div>
          </header>

          {hasActiveFilters ? (
            <section className="dashboard-reveal border-b border-zinc-200 pb-5">
              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                    Seçim paneli
                  </p>
                  <h2 className="text-2xl font-semibold leading-tight text-zinc-900">
                    Cari filtrlərə uyğun {filteredProducts.length} məhsul tapıldı
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    Məhsulları istədiyiniz qaydada sıralayıb daha tez seçim edin.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveFilters}
                      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
                    >
                      Filtri yadda saxla
                    </button>
                    {saveStatus ? (
                      <span className="text-xs text-zinc-500">{saveStatus}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          ) : null}

        </section>
        <div className="order-2 lg:col-start-1 lg:row-span-2">
          <CategorySidebar
            categories={catalogCategories}
            activeCategoryId={activeCategoryId}
            selectedItem={selectedItem}
            onSelectCategory={setActiveCategoryId}
            onSelectItem={setSelectedItem}
            stockFilter={stockFilter}
            onStockFilterChange={setStockFilter}
            pricePreset={pricePreset}
            onPricePresetChange={setPricePreset}
            onlyDiscounted={onlyDiscounted}
            onOnlyDiscountedChange={setOnlyDiscounted}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onResetFilters={resetFilters}
            categoryCounts={categoryCounts}
            itemCounts={itemCounts}
          />
        </div>
        <section className="order-3 lg:col-start-2 lg:row-start-2">
          {filteredProducts.length > 0 ? (
            <div className="grid min-h-[560px] grid-cols-2 content-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="dashboard-reveal rounded-3xl border border-dashed border-zinc-200 bg-white p-6 text-center shadow-[0_12px_30px_rgba(24,24,27,0.04)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Heç bir nəticə yoxdur
              </p>
              <h3 className="mt-2 text-lg font-semibold text-zinc-900">
                Bu filtrlərlə uyğun məhsul tapılmadı
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                Kateqoriya və qiymət aralığını dəyişərək yenidən yoxlayın.
              </p>
              <button
                type="button"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-zinc-800"
                onClick={resetFilters}
              >
                Filtrləri sıfırla
              </button>
            </div>
          )}
        </section>
      </main>

      <div className="site-shell mt-8 space-y-12">
        <OrderRequestSection />
        <ServiceHighlights />
      </div>

      <div className="site-shell mt-10">
        <section className="brand-strip rounded-[24px] bg-white py-6">
          <div className="brand-strip-fade" />
          <div className="brand-strip-track">
            {[...brandLogos, ...brandLogos].map((logo, index) => (
              <div key={`${logo}-${index}`} className="brand-strip-item">
                <Image
                  src={logo}
                  alt="Hissə Baku tərəfdaş brendi"
                  width={200}
                  height={64}
                  className="brand-strip-logo"
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="site-shell pb-12 pt-10">
        <SiteFooter />
      </div>

      <AdvancedFiltersModal
        isOpen={isAdvancedModalOpen}
        onClose={() => setIsAdvancedModalOpen(false)}
        stockFilter={stockFilter}
        onStockFilterChange={setStockFilter}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        onlyDiscounted={onlyDiscounted}
        onOnlyDiscountedChange={setOnlyDiscounted}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />
    </div>
  );
}
