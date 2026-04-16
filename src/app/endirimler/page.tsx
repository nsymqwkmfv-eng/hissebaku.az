"use client";

import { BadgePercent, Clock, Sparkles, Tag } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandHeader } from "@/components/brand-header";
import { ServiceHighlights } from "@/components/service-highlights";
import { SiteFooter } from "@/components/site-footer";
import { categories, products } from "@/data/catalog";

export default function EndirimlerPage() {
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

  const discountedProducts = products.filter((product) => product.discount);

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
        resultCount={discountedProducts.length}
      />

      <main className="site-shell py-8 md:py-10">
        <section className="rounded-[28px] border border-zinc-200 bg-[linear-gradient(120deg,#ffffff_0%,#f7f7f9_65%)] p-6 md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d51414]">
                Endirimlər
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-zinc-900 md:text-4xl">
                Seçilmiş hissələrdə xüsusi endirimlər
              </h1>
              <p className="mt-3 text-sm text-zinc-600 md:text-base">
                Kampaniya məhsulları, sezon təklifləri və məhdud stok endirimlərini
                buradan izləyin.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 text-sm text-zinc-700">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-[#d51414]" />
                <span>Endirimlər hər həftə yenilənir</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: BadgePercent,
              title: "Top endirimlər",
              text: "30%-a qədər seçilmiş brend kampaniyaları.",
            },
            {
              icon: Sparkles,
              title: "Yeni sezon",
              text: "Mövsümə uyğun kampaniya paketləri.",
            },
            {
              icon: Tag,
              title: "Eksklüziv təklif",
              text: "Sadiq müştərilər üçün xüsusi qiymətlər.",
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
