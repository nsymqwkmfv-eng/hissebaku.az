"use client";

import { Headphones, MessageSquareText, Timer, User } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandHeader } from "@/components/brand-header";
import { SiteFooter } from "@/components/site-footer";
import { categories, products } from "@/data/catalog";

export default function ChatOperatorPage() {
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
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d51414]">
            Çat və operator
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-zinc-900 md:text-4xl">
            Canlı dəstək ilə doğru hissəni seçin
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-zinc-600 md:text-base">
            Komandamız məhsul uyğunluğu, stok məlumatı və sifariş statusu üçün
            hər gün sizə operativ dəstək verir.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Headphones, title: "Operativ cavab", text: "Orta cavab müddəti 3 dəqiqə." },
            { icon: MessageSquareText, title: "WhatsApp & zəng", text: "Sizə uyğun kanalı seçin." },
            { icon: User, title: "Mütəxəssis heyət", text: "OEM uyğunluğu üzrə dəstək." },
            { icon: Timer, title: "7/7 xidmət", text: "Həftə sonu da aktiv dəstək." },
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
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Əlaqə</p>
              <h2 className="mt-2 text-2xl font-semibold">Operator ilə indi danışın</h2>
              <p className="mt-2 text-sm text-zinc-300">
                Sorğunuzu WhatsApp-da yazın və ən qısa zamanda cavab alın.
              </p>
            </div>
            <a
              href="tel:+994503919290"
              className="inline-flex items-center justify-center rounded-xl bg-[#d51414] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b91111]"
            >
              Zəng et
            </a>
          </div>
        </section>
      </main>

      <div className="site-shell pb-12 pt-10">
        <SiteFooter />
      </div>
    </div>
  );
}
