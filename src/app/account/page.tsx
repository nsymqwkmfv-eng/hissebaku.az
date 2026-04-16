"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Heart, LogOut, Mail, Plus, ShieldCheck, User } from "lucide-react";
import { BrandHeader } from "@/components/brand-header";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/lib/supabaseClient";
import type { Category, Product } from "@/types/catalog";

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number | null;
  vin: string | null;
};

type SavedFilter = {
  id: string;
  label: string;
  payload: Record<string, unknown>;
};

type PriceAlert = {
  id: string;
  product_id: string;
  target_price: number | null;
};

export default function AccountPage() {
  const [searchDraft, setSearchDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [session, setSession] = useState<any | null>(null);
  const [authStep, setAuthStep] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [vehicleForm, setVehicleForm] = useState({ make: "", model: "", year: "", vin: "" });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const suggestionPool = useMemo(() => [], []);
  const vehiclePresets = [
    { make: "Mercedes-Benz", model: "GLE", year: "2018" },
    { make: "Mercedes-Benz", model: "C-Class", year: "2016" },
    { make: "BMW", model: "X5", year: "2017" },
    { make: "BMW", model: "3 Series", year: "2015" },
    { make: "Toyota", model: "Camry", year: "2019" },
    { make: "Toyota", model: "Prado", year: "2014" },
    { make: "Hyundai", model: "Elantra", year: "2018" },
    { make: "Kia", model: "Sportage", year: "2017" },
    { make: "Nissan", model: "X-Trail", year: "2013" },
    { make: "Volkswagen", model: "Passat", year: "2015" },
  ];

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    const sb = supabase;

    let isMounted = true;

    const init = async () => {
      const { data } = await sb.auth.getSession();
      if (!isMounted) {
        return;
      }
      setSession(data.session);
      setIsLoading(false);
    };

    init();

    const { data: listener } = sb.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !session?.user?.id) {
      return;
    }

    const sb = supabase;

    const userId = session.user.id as string;

    const toProduct = (row: any): Product => ({
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
    });

    const loadProfile = async () => {
      const [{ data: vehicleRows }, { data: favoriteRows }, { data: filterRows }, { data: recentRows }, { data: alertRows }] =
        await Promise.all([
          sb.from("user_vehicles").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
          sb.from("favorites").select("product_id").eq("user_id", userId),
          sb.from("saved_filters").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
          sb.from("recent_views").select("product_id").eq("user_id", userId).order("viewed_at", { ascending: false }).limit(6),
          sb.from("price_alerts").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        ]);

      setVehicles((vehicleRows ?? []).map((row) => ({
        id: row.id,
        make: row.make,
        model: row.model,
        year: row.year ?? null,
        vin: row.vin ?? null,
      })));

      const favoriteIds = (favoriteRows ?? []).map((row) => row.product_id).filter(Boolean);
      if (favoriteIds.length > 0) {
        const { data: favoriteProducts } = await sb
          .from("products")
          .select("*")
          .in("id", favoriteIds);
        setFavorites((favoriteProducts ?? []).map(toProduct));
      } else {
        setFavorites([]);
      }

      const recentIds = (recentRows ?? []).map((row) => row.product_id).filter(Boolean);
      if (recentIds.length > 0) {
        const { data: recentProductsRows } = await sb
          .from("products")
          .select("*")
          .in("id", recentIds);
        setRecentProducts((recentProductsRows ?? []).map(toProduct));
      } else {
        setRecentProducts([]);
      }

      setSavedFilters((filterRows ?? []).map((row) => ({
        id: row.id,
        label: row.label,
        payload: row.payload ?? {},
      })));

      setPriceAlerts((alertRows ?? []).map((row) => ({
        id: row.id,
        product_id: row.product_id,
        target_price: row.target_price,
      })));
    };

    loadProfile();
  }, [session]);

  const sendOtp = async () => {
    setAuthError(null);
    setStatusMessage(null);

    if (!supabase) {
      setAuthError("Supabase env dəyişənləri tapılmadı.");
      return;
    }

    if (!email) {
      setAuthError("Email daxil edin.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    setAuthStep("verify");
    setStatusMessage("OTP kodu email ünvanınıza göndərildi.");
  };

  const handleAuth = async () => {
    setAuthError(null);
    setStatusMessage(null);

    if (!supabase) {
      setAuthError("Supabase env dəyişənləri tapılmadı.");
      return;
    }

    if (!email) {
      setAuthError("Email daxil edin.");
      return;
    }

    if (authStep === "request") {
      await sendOtp();
      return;
    }

    if (!otpCode) {
      setAuthError("OTP kodunu daxil edin.");
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: "email",
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    setStatusMessage("Daxil oldunuz.");
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
    setSession(null);
  };

  const handleAddVehicle = async () => {
    if (!supabase || !session?.user?.id) {
      return;
    }

    if (!vehicleForm.make || !vehicleForm.model) {
      setStatusMessage("Marka və model daxil edin.");
      return;
    }

    const payload = {
      user_id: session.user.id,
      make: vehicleForm.make.trim(),
      model: vehicleForm.model.trim(),
      year: vehicleForm.year ? Number(vehicleForm.year) : null,
      vin: vehicleForm.vin.trim() || null,
    };

    const { data, error } = await supabase.from("user_vehicles").insert(payload).select();
    if (error) {
      setAuthError(error.message);
      return;
    }

    if (data?.[0]) {
      setVehicles((prev) => [
        {
          id: data[0].id,
          make: data[0].make,
          model: data[0].model,
          year: data[0].year ?? null,
          vin: data[0].vin ?? null,
        },
        ...prev,
      ]);
    }

    setVehicleForm({ make: "", model: "", year: "", vin: "" });
    setStatusMessage("Avtomobil əlavə edildi.");
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!supabase || !session?.user?.id) {
      return;
    }
    await supabase.from("user_vehicles").delete().eq("id", vehicleId);
    setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== vehicleId));
  };

  const handleApplyFilter = (payload: Record<string, unknown>) => {
    const encoded = encodeURIComponent(JSON.stringify(payload));
    router.push(`/?filters=${encoded}`);
  };

  const handleDeleteFilter = async (filterId: string) => {
    if (!supabase || !session?.user?.id) {
      return;
    }
    await supabase.from("saved_filters").delete().eq("id", filterId);
    setSavedFilters((prev) => prev.filter((item) => item.id !== filterId));
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (!supabase || !session?.user?.id) {
      return;
    }
    await supabase.from("price_alerts").delete().eq("id", alertId);
    setPriceAlerts((prev) => prev.filter((item) => item.id !== alertId));
  };

  if (!supabase) {
    return (
      <div className="min-h-screen">
        <main className="site-shell py-10">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-zinc-700">
            Supabase env dəyişənləri tapılmadı.
          </div>
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
        resultCount={0}
      />

      <main className="site-shell py-8 md:py-10">
        <section className="rounded-[28px] border border-zinc-200 bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d51414]">
                Profil
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-zinc-900 md:text-3xl">
                Hesabınızı idarə edin
              </h1>
            </div>
            {session ? (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
                onClick={handleSignOut}
              >
                <LogOut className="size-4" />
                Çıxış et
              </button>
            ) : null}
          </div>

          {isLoading ? (
            <p className="mt-4 text-sm text-zinc-500">Yüklənir...</p>
          ) : session ? (
            <div className="mt-6 space-y-8">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-white text-[#d51414]">
                      <User className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                        Email
                      </p>
                      <p className="text-sm font-semibold text-zinc-900">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                    Aktiv bildirişlər
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-zinc-900">
                    {priceAlerts.length}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-zinc-900">Avtomobillərim</h2>
                    <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                      {vehicles.length} qeyd
                    </span>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                        Hazır seçimlər
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {vehiclePresets.map((preset) => (
                          <button
                            key={`${preset.make}-${preset.model}-${preset.year}`}
                            type="button"
                            onClick={() =>
                              setVehicleForm({
                                make: preset.make,
                                model: preset.model,
                                year: preset.year,
                                vin: "",
                              })
                            }
                            className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
                          >
                            {preset.make} {preset.model} {preset.year}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="block">
                        <span className="mb-1 block text-xs text-zinc-500">Marka</span>
                        <input
                          value={vehicleForm.make}
                          onChange={(event) =>
                            setVehicleForm((prev) => ({ ...prev, make: event.target.value }))
                          }
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
                          placeholder="Mercedes-Benz"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-xs text-zinc-500">Model</span>
                        <input
                          value={vehicleForm.model}
                          onChange={(event) =>
                            setVehicleForm((prev) => ({ ...prev, model: event.target.value }))
                          }
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
                          placeholder="GLE"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-xs text-zinc-500">İl</span>
                        <input
                          type="number"
                          value={vehicleForm.year}
                          onChange={(event) =>
                            setVehicleForm((prev) => ({ ...prev, year: event.target.value }))
                          }
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
                          placeholder="2020"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-xs text-zinc-500">VIN</span>
                        <input
                          value={vehicleForm.vin}
                          onChange={(event) =>
                            setVehicleForm((prev) => ({ ...prev, vin: event.target.value }))
                          }
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
                          placeholder="VIN"
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVehicle}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white"
                    >
                      <Plus className="size-4" />
                      Avtomobil əlavə et
                    </button>
                  </div>
                  <div className="space-y-2">
                    {vehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">
                            {vehicle.make} {vehicle.model} {vehicle.year ?? ""}
                          </p>
                          {vehicle.vin ? (
                            <p className="text-xs text-zinc-500">VIN: {vehicle.vin}</p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                          className="text-xs font-semibold text-zinc-500 transition hover:text-zinc-900"
                        >
                          Sil
                        </button>
                      </div>
                    ))}
                    {vehicles.length === 0 ? (
                      <p className="text-sm text-zinc-500">Hələ avtomobil əlavə edilməyib.</p>
                    ) : null}
                  </div>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-zinc-900">Saxlanılan filtrlər</h2>
                    <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                      {savedFilters.length} filtr
                    </span>
                  </div>
                  <div className="space-y-2">
                    {savedFilters.map((filter) => (
                      <div key={filter.id} className="rounded-2xl border border-zinc-200 bg-white p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-zinc-900">{filter.label}</p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleApplyFilter(filter.payload)}
                              className="text-xs font-semibold text-zinc-600 transition hover:text-zinc-900"
                            >
                              Tətbiq et
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFilter(filter.id)}
                              className="text-xs font-semibold text-zinc-500 transition hover:text-zinc-900"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {savedFilters.length === 0 ? (
                      <p className="text-sm text-zinc-500">Hələ filtr saxlanılmayıb.</p>
                    ) : null}
                  </div>
                </section>
              </div>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-zinc-900">Seçilmişlər</h2>
                  <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                    {favorites.length} məhsul
                  </span>
                </div>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-5 text-sm text-zinc-500">
                    Hələ sevimli məhsul əlavə edilməyib.
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-zinc-900">Son baxılanlar</h2>
                  <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                    {recentProducts.length} məhsul
                  </span>
                </div>
                {recentProducts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {recentProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-5 text-sm text-zinc-500">
                    Hələ məhsula baxılmayıb.
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-zinc-900">Qiymət bildirişləri</h2>
                  <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                    {priceAlerts.length} qeyd
                  </span>
                </div>
                <div className="space-y-2">
                  {priceAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-3">
                      <p className="text-sm text-zinc-700">
                        Məhsul ID: {alert.product_id}
                        {alert.target_price ? ` · Hədəf ${alert.target_price} ₼` : ""}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="text-xs font-semibold text-zinc-500 transition hover:text-zinc-900"
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                  {priceAlerts.length === 0 ? (
                    <p className="text-sm text-zinc-500">Hələ bildiriş qurulmayıb.</p>
                  ) : null}
                </div>
              </section>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-zinc-200 bg-[linear-gradient(140deg,#ffffff_0%,#f6f7f9_60%)] p-6 shadow-[0_20px_40px_rgba(24,24,27,0.06)]">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-white text-[#d51414] shadow-[0_10px_22px_rgba(213,20,20,0.14)]">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">OTP giriş</p>
                    <h2 className="mt-1 text-xl font-semibold text-zinc-900">Email ilə daxil olun</h2>
                  </div>
                </div>
                <p className="mt-3 text-sm text-zinc-600">
                  Email ünvanınızı yazın, gələn OTP kodu ilə daxil olun. Qeydiyyat avtomatik yaradılır.
                </p>
                {authError ? <p className="mt-3 text-sm text-[#d51414]">{authError}</p> : null}
                {statusMessage ? (
                  <p className="mt-3 text-sm text-emerald-600">{statusMessage}</p>
                ) : null}
                <div className="mt-5 space-y-3">
                  <label className="block">
                    <span className="mb-1 block text-xs text-zinc-500">Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="email@example.com"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700"
                    />
                  </label>
                  {authStep === "verify" ? (
                    <label className="block">
                      <span className="mb-1 block text-xs text-zinc-500">OTP kodu</span>
                      <input
                        value={otpCode}
                        onChange={(event) => setOtpCode(event.target.value)}
                        placeholder="6 rəqəmli kod"
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700"
                      />
                    </label>
                  ) : null}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleAuth}
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    {authStep === "verify" ? "Kodu təsdiqlə" : "OTP göndər"}
                  </button>
                  {authStep === "verify" ? (
                    <>
                      <button
                        type="button"
                        onClick={sendOtp}
                        className="inline-flex flex-1 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-600"
                      >
                        Yenidən göndər
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthStep("request");
                          setOtpCode("");
                        }}
                        className="inline-flex flex-1 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-600"
                      >
                        Dəyişdir
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-5 text-[#d51414]" />
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Profil üstünlükləri</p>
                    <p className="text-xs text-zinc-500">Hamısı avtomatik sinxronlaşır</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    Seçilmişlər və son baxılanlar
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    Avtomobil məlumatları və filtrlər
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    Qiymət bildirişləri
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <div className="site-shell pb-12 pt-10">
        <SiteFooter />
      </div>
    </div>
  );
}
