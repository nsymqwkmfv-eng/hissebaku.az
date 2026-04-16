"use client";

import { AlertTriangle, Shield, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandHeader } from "@/components/brand-header";
import { ServiceHighlights } from "@/components/service-highlights";
import { SiteFooter } from "@/components/site-footer";
import { categories, products } from "@/data/catalog";

export default function EylecSistemiPage() {
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
        <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_16px_36px_rgba(24,24,27,0.06)] md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d51414]">
                Əyləc sistemi
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-zinc-900 md:text-4xl">
                Təhlükəsizlik üçün etibarlı əyləc detallarını seçin
              </h1>
              <p className="mt-3 text-sm text-zinc-600 md:text-base">
                Disk, bənd, naklatka və bütün əyləc komponentləri orijinal brend
                zəmanəti ilə təqdim olunur.
              </p>
            </div>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 size-5" />
                <div>
                  <p className="font-semibold">Dəyişmə xəbərdarlığı</p>
                  <p className="mt-1 text-xs text-red-600">
                    Pedalda titrəmə və səs varsa, detallar dərhal yoxlanılmalıdır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "Zəmanətli məhsullar",
              text: "Bütün əyləc detallarında rəsmi zəmanət və sertifikatlar.",
            },
            {
              icon: Wrench,
              title: "Usta məsləhəti",
              text: "Modeliniz üçün uyğunluq və montaj üzrə dəstək.",
            },
            {
              icon: AlertTriangle,
              title: "Dəqiq uyğunluq",
              text: "VIN kodu ilə düzgün əyləc seçimi təmin edilir.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-zinc-200 bg-white p-5">
              <item.icon className="size-5 text-[#d51414]" />
              <h3 className="mt-2 text-sm font-semibold text-zinc-900">{item.title}</h3>
              <p className="mt-1 text-xs text-zinc-500">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-3xl bg-zinc-900 p-6 text-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Sifariş</p>
              <h2 className="mt-2 text-2xl font-semibold">Əyləc detallarını indi sifariş edin</h2>
              <p className="mt-2 text-sm text-zinc-300">
                Əyləc sisteminizin təhlükəsizliyini artırmaq üçün mütəxəssisimizə yazın.
              </p>
            </div>
            <a
              href="https://wa.me/994503919290?text=Salam%21%20Sifaris%20ucun%20yaziram."
              className="inline-flex items-center justify-center rounded-xl bg-[#d51414] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b91111]"
            >
              Mütəxəssisə zəng et
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
