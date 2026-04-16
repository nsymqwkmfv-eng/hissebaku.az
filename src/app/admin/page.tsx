"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  Package,
  Plus,
  Search,
  Tag,
  Trash2,
  Wrench,
} from "lucide-react";
import { BrandHeader } from "@/components/brand-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/lib/supabaseClient";
import { categories as fallbackCategories, products as fallbackProducts } from "@/data/catalog";

type DbCategory = {
  id: string;
  title: string;
  icon: string | null;
  items: string[];
};

type DbProduct = {
  id: string;
  slug: string;
  category_id: string | null;
  title: string;
  part_type: string;
  description: string;
  images: Array<{ src: string; alt: string }>;
  price: number;
  discount: number | null;
  in_stock: boolean;
};

type ProductFormState = {
  id?: string;
  title: string;
  slug: string;
  categoryId: string;
  partType: string;
  price: string;
  discount: string;
  inStock: boolean;
  description: string;
  imageUrls: string;
};

const emptyForm: ProductFormState = {
  title: "",
  slug: "",
  categoryId: "",
  partType: "",
  price: "",
  discount: "",
  inStock: true,
  description: "",
  imageUrls: "",
};

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export default function AdminPage() {
  const [searchDraft, setSearchDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [authUser, setAuthUser] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [stockView, setStockView] = useState<"all" | "in" | "out">("all");
  const [supabaseReady, setSupabaseReady] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const router = useRouter();

  const suggestionPool = useMemo(
    () =>
      Array.from(
        new Set([
          ...products.map((product) => product.title),
          ...products.map((product) => product.part_type),
          ...categories.map((category) => category.title),
        ]),
      ),
    [products, categories],
  );

  useEffect(() => {
    const stored = window.localStorage.getItem("admin_authed");
    if (stored === "true") {
      setIsAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthed) {
      return;
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !supabase) {
      setSupabaseReady(false);
      setLoadError("Supabase env dəyişənləri tapılmadı.");
      return;
    }

    const sb = supabase;

    const loadAll = async () => {
      setIsLoading(true);
      const { data: categoryRows, error: categoryError } = await sb
        .from("categories")
        .select("*");
      const { data: productRows, error: productError } = await sb
        .from("products")
        .select("*");

      if (categoryError || productError) {
        setLoadError("Supabase məlumatları yüklənmədi. Kataloqdan idxal edin.");
      }

      setCategories(categoryRows ?? []);
      setProducts(productRows ?? []);
      setIsUsingFallback(false);
      setIsLoading(false);
    };

    loadAll();

    const channel = sb
      .channel("admin-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => loadAll(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        () => loadAll(),
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [isAuthed]);

  const handleLogin = () => {
    const envUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME ?? "";
    const envPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";

    if (!envUser || !envPass) {
      setAuthError("Admin istifadəçi adı və şifrə env-də təyin edilməlidir.");
      return;
    }

    if (authUser === envUser && authPass === envPass) {
      setIsAuthed(true);
      setAuthError(null);
      window.localStorage.setItem("admin_authed", "true");
      return;
    }

    setAuthError("İstifadəçi adı və ya şifrə yanlışdır.");
  };

  const filteredProducts = useMemo(() => {
    const needle = filterText.toLowerCase().trim();
    return products.filter((product) => {
      if (stockView === "in" && !product.in_stock) {
        return false;
      }
      if (stockView === "out" && product.in_stock) {
        return false;
      }
      if (!needle) {
        return true;
      }

      return [product.title, product.part_type, product.slug]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [filterText, products, stockView]);

  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((product) => product.in_stock).length;
    const outOfStock = total - inStock;
    const categoriesCount = categories.length;
    return { total, inStock, outOfStock, categoriesCount };
  }, [products, categories]);

  const startEdit = (product: DbProduct) => {
    setForm({
      id: product.id,
      title: product.title,
      slug: product.slug,
      categoryId: product.category_id ?? "",
      partType: product.part_type,
      price: String(product.price),
      discount: product.discount ? String(product.discount) : "",
      inStock: product.in_stock,
      description: product.description,
      imageUrls: product.images.map((image) => image.src).join("\n"),
    });
  };

  const resetForm = () => setForm(emptyForm);

  const handleImportFromLocal = async () => {
    if (!supabaseReady || !supabase) {
      setAuthError("Supabase env dəyişənləri tapılmadı.");
      return;
    }
    setIsImporting(true);

    await supabase.from("categories").upsert(
      fallbackCategories.map((category) => ({
        id: category.id,
        title: category.title,
        icon: category.icon,
        items: category.items,
      })),
    );

    const productPayload = fallbackProducts.map((product) => ({
      slug: product.slug,
      category_id: product.categoryId,
      title: product.title,
      part_type: product.partType,
      description: product.description,
      images: product.images,
      price: product.price,
      discount: product.discount ?? null,
      in_stock: product.inStock,
    }));

    await supabase.from("products").upsert(productPayload, { onConflict: "slug" });

    const { data: productRows } = await supabase.from("products").select("*");
    setProducts(productRows ?? []);
    setIsImporting(false);
  };

  const handleSave = async () => {
    if (!supabase) {
      setAuthError("Supabase env dəyişənləri tapılmadı.");
      return;
    }
    if (!form.title.trim()) {
      setAuthError("Məhsul adı boş ola bilməz.");
      return;
    }

    setIsSaving(true);
    const images = form.imageUrls
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((src, index) => ({
        src,
        alt: `${form.title} - ${index + 1}`,
      }));

    const payload = {
      slug: form.slug.trim() || slugify(form.title),
      category_id: form.categoryId || null,
      title: form.title.trim(),
      part_type: form.partType.trim(),
      description: form.description.trim(),
      images,
      price: Number(form.price || 0),
      discount: form.discount ? Number(form.discount) : null,
      in_stock: form.inStock,
    };

    if (form.id) {
      const { data, error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", form.id)
        .select();

      if (!error && data) {
        setProducts((prev) => prev.map((item) => (item.id === form.id ? data[0] : item)));
        resetForm();
      }
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert(payload)
        .select();

      if (!error && data) {
        setProducts((prev) => [data[0], ...prev]);
        resetForm();
      }
    }

    setIsSaving(false);
  };

  const handleDelete = async (productId: string) => {
    if (!supabase) {
      setAuthError("Supabase env dəyişənləri tapılmadı.");
      return;
    }
    if (!window.confirm("Məhsulu silmək istədiyinizə əminsiniz?")) {
      return;
    }
    await supabase.from("products").delete().eq("id", productId);
    setProducts((prev) => prev.filter((item) => item.id !== productId));
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen">
        <BrandHeader
          searchDraft={searchDraft}
          onSearchDraftChange={setSearchDraft}
          onApplySearch={(value) => {
            const nextQuery = (value ?? searchDraft).trim();
            setSearchQuery(nextQuery);
            if (nextQuery) {
              router.push(`/?q=${encodeURIComponent(nextQuery)}`);
            } else {
              router.push("/");
            }
          }}
          onClearAll={() => {
            setSearchDraft("");
            setSearchQuery("");
            router.push("/");
          }}
          suggestionPool={suggestionPool}
          onOpenAdvancedFilters={() => setSearchQuery(searchDraft.trim())}
          resultCount={products.length}
        />

        <main className="site-shell py-10">
          <section className="rounded-[28px] border border-zinc-200 bg-white p-6 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d51414]">
              Admin panel
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-zinc-900 md:text-4xl">
              Hissə Baku idarəetmə mərkəzi
            </h1>
            <p className="mt-3 text-sm text-zinc-600 md:text-base">
              Məhsulların idarəsi üçün daxil olun.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm text-zinc-500">İstifadəçi adı</span>
                <input
                  value={authUser}
                  onChange={(event) => setAuthUser(event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 outline-none transition focus:border-zinc-300"
                  placeholder="admin"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-zinc-500">Şifrə</span>
                <input
                  type="password"
                  value={authPass}
                  onChange={(event) => setAuthPass(event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 outline-none transition focus:border-zinc-300"
                  placeholder="••••••••"
                />
              </label>
            </div>

            {authError ? (
              <p className="mt-3 text-sm text-[#d51414]">{authError}</p>
            ) : null}

            <button
              type="button"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
              onClick={handleLogin}
            >
              Daxil ol
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <BrandHeader
        searchDraft={searchDraft}
        onSearchDraftChange={setSearchDraft}
        onApplySearch={(value) => {
          const nextQuery = (value ?? searchDraft).trim();
          setSearchQuery(nextQuery);
          if (nextQuery) {
            router.push(`/?q=${encodeURIComponent(nextQuery)}`);
          } else {
            router.push("/");
          }
        }}
        onClearAll={() => {
          setSearchDraft("");
          setSearchQuery("");
          router.push("/");
        }}
        suggestionPool={suggestionPool}
        onOpenAdvancedFilters={() => setSearchQuery(searchDraft.trim())}
        resultCount={products.length}
      />

      <main className="site-shell py-10">
        <section className="rounded-[28px] border border-zinc-200 bg-white p-6 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d51414]">
                Admin panel
              </p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight text-zinc-900 md:text-4xl">
                Məhsul idarəsi
              </h1>
              <p className="mt-2 text-sm text-zinc-600">
                Yeni məhsul əlavə edin, stok və kateqoriya məlumatlarını yeniləyin.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
                <Search className="size-4 text-zinc-400" />
                <input
                  value={filterText}
                  onChange={(event) => setFilterText(event.target.value)}
                  placeholder="Məhsul axtar..."
                  className="w-44 bg-transparent text-sm text-zinc-700 outline-none"
                />
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
                onClick={resetForm}
              >
                <Plus className="size-4" />
                Yeni məhsul
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
                onClick={handleImportFromLocal}
                disabled={isImporting}
              >
                {isImporting ? <Loader2 className="size-4 animate-spin" /> : <Wrench className="size-4" />}
                {isImporting ? "İdxal edilir..." : "Kataloqdan idxal"}
              </button>
            </div>
          </div>

          {!supabaseReady ? (
            <p className="mt-4 text-sm text-[#d51414]">
              Supabase env dəyişənləri tapılmadı. NEXT_PUBLIC_SUPABASE_URL və
              NEXT_PUBLIC_SUPABASE_ANON_KEY dəyərlərini əlavə edin.
            </p>
          ) : null}
          {loadError ? (
            <p className="mt-2 text-sm text-[#d51414]">{loadError}</p>
          ) : null}
          {isUsingFallback ? (
            <p className="mt-2 text-sm text-zinc-500">
              Supabase boşdur. Kataloqdan idxal edin ki, məlumatlar bazaya yazılsın.
            </p>
          ) : null}

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Məhsul</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{stats.total}</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Stokda</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{stats.inStock}</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Stokda yox</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{stats.outOfStock}</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Kateqoriya</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{stats.categoriesCount}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                    Məhsul siyahısı
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em]">
                    {[
                      { key: "all", label: "Hamısı" },
                      { key: "in", label: "Stokda" },
                      { key: "out", label: "Bitib" },
                    ].map((chip) => (
                      <button
                        key={chip.key}
                        type="button"
                        className={`rounded-full px-3 py-1 transition ${
                          stockView === chip.key
                            ? "bg-zinc-900 text-white"
                            : "bg-white text-zinc-600 hover:text-zinc-900"
                        }`}
                        onClick={() => setStockView(chip.key as "all" | "in" | "out")}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
                {isLoading ? (
                  <p className="mt-3 text-sm text-zinc-500">Yüklənir...</p>
                ) : (
                  <div className="mt-3 max-h-[520px] space-y-2 overflow-y-auto pr-1">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className={`flex min-h-[88px] flex-col gap-3 rounded-xl border bg-white p-3 transition md:flex-row md:items-center md:justify-between ${
                          form.id === product.id
                            ? "border-zinc-900 shadow-[0_12px_30px_rgba(24,24,27,0.12)]"
                            : "border-zinc-200 hover:border-zinc-300"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                            {product.images?.[0]?.src ? (
                              <Image
                                src={product.images[0].src}
                                alt={product.images[0].alt ?? product.title}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-zinc-400">
                                <ImagePlus className="size-4" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="max-h-[40px] min-h-[40px] overflow-hidden text-sm font-semibold leading-5 text-zinc-900">
                              {product.title}
                            </p>
                            <p className="max-h-[16px] min-h-[16px] overflow-hidden text-xs leading-4 text-zinc-500">
                              {product.part_type} · {product.category_id ?? "Kateqoriya yoxdur"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                              product.in_stock
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {product.in_stock ? "Stokda" : "Bitib"}
                          </span>
                          {product.discount ? (
                            <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#d51414]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#d51414]">
                              {product.discount}% endirim
                            </span>
                          ) : null}
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
                            onClick={() => startEdit(product)}
                          >
                            <Tag className="size-3" />
                            Düzəliş et
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:border-red-300"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="size-3" />
                            Sil
                          </button>
                        </div>
                      </div>
                    ))}
                    {filteredProducts.length === 0 ? (
                      <p className="text-sm text-zinc-500">
                        Məhsul tapılmadı. Kataloqdan idxal edin.
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 transition-all duration-300 lg:sticky lg:top-6">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Məhsul formu
              </p>
              <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-20 overflow-hidden rounded-xl border border-zinc-200 bg-white">
                    {form.imageUrls.split("\n").map((line) => line.trim()).filter(Boolean)[0] ? (
                      <Image
                        src={form.imageUrls.split("\n").map((line) => line.trim()).filter(Boolean)[0]}
                        alt={form.title || "Ön görüntü"}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-400">
                        <ImagePlus className="size-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      {form.title || "Yeni məhsul"}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {form.partType || "Part type"}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px]">
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700">
                        {form.price ? `${form.price} ₼` : "Qiymət"}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                          form.inStock
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {form.inStock ? "Stokda" : "Bitib"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <label className="block">
                  <span className="mb-1 block text-xs text-zinc-500">Məhsul adı</span>
                  <input
                    value={form.title}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        title: event.target.value,
                        slug: prev.slug || slugify(event.target.value),
                      }))
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs text-zinc-500">Slug</span>
                  <input
                    value={form.slug}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        slug: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs text-zinc-500">Kateqoriya</span>
                  <select
                    value={form.categoryId}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        categoryId: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
                  >
                    <option value="">Seçim edin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs text-zinc-500">Part type</span>
                  <input
                    value={form.partType}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        partType: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 outline-none"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs text-zinc-500">Qiymət (AZN)</span>
                    <input
                      value={form.price}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          price: event.target.value,
                        }))
                      }
                      type="number"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-zinc-500">Endirim (%)</span>
                    <input
                      value={form.discount}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          discount: event.target.value,
                        }))
                      }
                      type="number"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 outline-none"
                    />
                  </label>
                </div>

                <label className="flex items-center gap-2 text-xs text-zinc-500">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        inStock: event.target.checked,
                      }))
                    }
                    className="size-4 rounded border-zinc-300"
                  />
                  Stokda var
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs text-zinc-500">Təsvir</span>
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs text-zinc-500">Şəkil linkləri (hər sətirdə 1)</span>
                  <textarea
                    value={form.imageUrls}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        imageUrls: event.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 outline-none"
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  {form.imageUrls
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((url) => (
                      <div key={url} className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-500">
                        {url}
                      </div>
                    ))}
                </div>

                {authError ? (
                  <p className="text-xs text-[#d51414]">{authError}</p>
                ) : null}

                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
                    onClick={resetForm}
                    disabled={isSaving}
                  >
                    Ləğv et
                  </button>
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Yadda saxlanır..." : "Yadda saxla"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="site-shell pb-12 pt-10">
        <SiteFooter />
      </div>
    </div>
  );
}
