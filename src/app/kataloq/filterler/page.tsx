"use client";

import { Filter, ShieldCheck, Wind } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandHeader } from "@/components/brand-header";
import { ServiceHighlights } from "@/components/service-highlights";
import { SiteFooter } from "@/components/site-footer";
import { categories, products } from "@/data/catalog";

export default function FilterlerPage() {
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
        <section className="rounded-[28px] border border-zinc-200 bg-white p-6 md:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d51414]">
                Filtrlər
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-zinc-900 md:text-4xl">
                Hava, yağ və yanacaq filtrlərində maksimum qoruma
              </h1>
              <p className="mt-3 text-sm text-zinc-600 md:text-base">
                Filtr seçimində düzgün material, keçirmə qabiliyyəti və servis
                aralığı əsasdır. Hissə Baku-da orijinal filtr seçimi sizi qoruyur.
              </p>
            </div>
            <div className="rounded-3xl bg-zinc-900 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Uyğunluq</p>
              <h2 className="mt-2 text-xl font-semibold">VIN kodu ilə dəqiqləşdirin</h2>
              <p className="mt-2 text-sm text-zinc-300">
                Avtomobiliniz üçün ən uyğun filtr modelini tapmaq üçün bizi
                məlumatlandırın.
              </p>
              <a
                href="tel:+994503919290"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#d51414] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b91111]"
              >
                Dəstək al
              </a>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Wind,
              title: "Hava filtri",
              text: "Mühərrikə təmiz hava axını üçün ideal seçim.",
            },
            {
              icon: Filter,
              title: "Yağ filtri",
              text: "Mühərriki çirklərdən qoruyan uzunömürlü filtr.",
            },
            {
              icon: ShieldCheck,
              title: "Yanacaq filtri",
              text: "Yanacaq sistemini qoruyan yüksək təmizlik səviyyəsi.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-zinc-200 bg-white p-5">
              <item.icon className="size-5 text-[#d51414]" />
              <h3 className="mt-2 text-sm font-semibold text-zinc-900">{item.title}</h3>
              <p className="mt-1 text-xs text-zinc-500">{item.text}</p>
            </div>
          ))}
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
