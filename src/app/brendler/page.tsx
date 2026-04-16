"use client";

import Image from "next/image";
import { Award, BadgeCheck, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandHeader } from "@/components/brand-header";
import { SiteFooter } from "@/components/site-footer";
import { categories, products } from "@/data/catalog";

const brandLogos = [
  "https://framerusercontent.com/images/ZM1bFT8UrjddZnDJbzHMus3IhGo.png?scale-down-to=512",
  "https://framerusercontent.com/images/GYAwkfbC4XA9ltrZpk6vXDzzQ0.png",
  "https://framerusercontent.com/images/KiB6R5VKBBiCETxSf71aQKbFw.png",
  "https://framerusercontent.com/images/pmEgfGxo0HcSqhK0uNdpggEV4U.png?scale-down-to=512",
  "https://framerusercontent.com/images/pAEzTk4J2ZTf9YzHikuCsVYubfM.png?scale-down-to=512",
  "https://framerusercontent.com/images/yqYBV6YQjClOfWKvYoE4Lml5E.png",
];

export default function BrendlerPage() {
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
            Brendlər
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-zinc-900 md:text-4xl">
            Dünyaca tanınmış avto brendləri ilə işləyirik
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-zinc-600 md:text-base">
            Hissə Baku-da yalnız rəsmi distribütorlar və orijinal məhsullar təqdim olunur.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: BadgeCheck,
              title: "Rəsmi tərəfdaşlar",
              text: "Təsdiqlənmiş və sertifikatlı brendlər.",
            },
            {
              icon: ShieldCheck,
              title: "Zəmanətli keyfiyyət",
              text: "Orijinal məhsullara rəsmi zəmanət.",
            },
            {
              icon: Award,
              title: "Premium seçim",
              text: "Seçilmiş dünya brendlərinin kolleksiyası.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-zinc-200 bg-white p-5">
              <item.icon className="size-5 text-[#d51414]" />
              <h3 className="mt-2 text-sm font-semibold text-zinc-900">{item.title}</h3>
              <p className="mt-1 text-xs text-zinc-500">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[24px] bg-white p-6 shadow-[0_16px_30px_rgba(24,24,27,0.06)]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brandLogos.map((logo) => (
              <div key={logo} className="flex items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <Image
                  src={logo}
                  alt="Brend loqosu"
                  width={180}
                  height={70}
                  className="h-12 w-[160px] object-contain opacity-80"
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="site-shell pb-12 pt-10">
        <SiteFooter />
      </div>
    </div>
  );
}
