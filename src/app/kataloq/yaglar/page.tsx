"use client";

import { Droplet, ShieldCheck, Sparkles, Timer } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandHeader } from "@/components/brand-header";
import { ServiceHighlights } from "@/components/service-highlights";
import { SiteFooter } from "@/components/site-footer";
import { categories, products } from "@/data/catalog";

export default function YaglarPage() {
  const [searchDraft, setSearchDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const suggestionPool = useMemo(
    () =>
      Array.from(
        new Set([
          ...products.map((product) => product.title),
          ...products.map((product) => product.partType),
          ...categories.map((category) => category.title),
        ]),
      ),
    [],
  );

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

      <main className="site-shell py-8 md:py-10">
        <section className="overflow-hidden rounded-[28px] border border-zinc-200 bg-[linear-gradient(120deg,#ffffff_0%,#f6f7f9_70%)] p-6 md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d51414]">
                Yağlar
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-zinc-900 md:text-4xl">
                Mühərrikin ömrünü uzadan premium yağ seçimi
              </h1>
              <p className="mt-3 text-sm text-zinc-600 md:text-base">
                Hissə Baku-da OEM standartlarına uyğun mühərrik və transmissiya
                yağları, düzgün viskozitə seçimi və servis dəstəyi ilə təqdim olunur.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-zinc-700 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-white/80 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Həcm</p>
                <p className="mt-1 text-base font-semibold text-zinc-900">1L - 5L</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white/80 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Standart</p>
                <p className="mt-1 text-base font-semibold text-zinc-900">ACEA / API</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_16px_30px_rgba(24,24,27,0.06)]">
            <h2 className="text-xl font-semibold text-zinc-900">Yağ seçimi bələdçisi</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { icon: Sparkles, title: "Sintetik yağlar", text: "Yüksək temperatur sabitliyi və uzunmüddətli qoruma." },
                { icon: Droplet, title: "Yarım sintetik", text: "Gündəlik sürüş üçün balanslı seçim." },
                { icon: ShieldCheck, title: "OEM uyğunluğu", text: "Avtomobil istehsalçısının tələblərinə cavab verir." },
                { icon: Timer, title: "Servis intervalı", text: "Daha uzun dəyişmə aralığı ilə rahatlıq." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
                  <item.icon className="size-5 text-[#d51414]" />
                  <h3 className="mt-2 text-sm font-semibold text-zinc-900">{item.title}</h3>
                  <p className="mt-1 text-xs text-zinc-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-zinc-900 p-6 text-white shadow-[0_20px_50px_rgba(12,14,18,0.28)]">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Tövsiyə</p>
            <h3 className="mt-2 text-2xl font-semibold">Düzgün viskozitə seçin</h3>
            <p className="mt-3 text-sm text-zinc-300">
              Avtomobil modelinə uyğun 5W-30, 5W-40, 0W-20 kimi seçimlər üçün
              mütəxəssislərimizlə əlaqə saxlayın.
            </p>
            <a
              href="tel:+994503919290"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#d51414] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b91111]"
            >
              Məsləhət al
            </a>
          </div>
        </section>

        <div className="mt-10">
          <ServiceHighlights />
        </div>
      </main>

      <div className="site-shell pb-12 pt-10">
        <SiteFooter />
      </div>
    </div>
  );
}
