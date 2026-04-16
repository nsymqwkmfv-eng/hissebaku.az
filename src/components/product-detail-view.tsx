"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandHeader } from "@/components/brand-header";
import { ServiceHighlights } from "@/components/service-highlights";
import { SiteFooter } from "@/components/site-footer";
import type { Category, Product } from "@/types/catalog";

type ProductDetailViewProps = {
  product: Product;
  categories: Category[];
  products: Product[];
};

export function ProductDetailView({ product, categories, products }: ProductDetailViewProps) {
  const [searchDraft, setSearchDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const router = useRouter();

  const suggestionPool = useMemo(
    () =>
      Array.from(
        new Set([
          ...products.map((item) => item.title),
          ...products.map((item) => item.partType),
          ...categories.map((category) => category.title),
        ]),
      ),
    [products, categories],
  );

  const descriptionBlocks = useMemo(
    () =>
      product.description
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    [product.description],
  );

  const activeImage = product.images[activeImageIndex] ?? product.images[0];
  const activeImageSrc = activeImage?.src;
  const productUrl = `https://hissebaku.az/products/${encodeURIComponent(
    product.slug ?? product.id,
  )}`;
  const whatsappMessage = encodeURIComponent(
    `Salam! Bu məhsul haqqında ətraflı məlumat almaq istəyirəm: ${productUrl}`,
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
        resultCount={1}
      />

      <main className="site-shell py-8 md:py-10">
        <div className="detail-page-enter rounded-[28px] border border-zinc-200 bg-white p-5 shadow-[0_18px_40px_rgba(24,24,27,0.08)] md:p-8">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
            >
              <ArrowLeft className="size-3.5" />
              Geri qayıt
            </Link>
            <span className="hidden text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 md:inline">
              Məhsul Detalları
            </span>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
            <div className="space-y-4">
              <div className="relative aspect-[4/3] w-full min-h-[320px] overflow-hidden rounded-3xl bg-zinc-100">
                {activeImageSrc ? (
                  <Image
                    src={activeImageSrc}
                    alt={activeImage?.alt ?? product.title}
                    fill
                    className="detail-image-fade object-contain"
                    sizes="(max-width: 1024px) 100vw, 520px"
                    key={activeImageSrc}
                    priority
                    loading="eager"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-zinc-400">
                    Sekil yoxdur
                  </div>
                )}
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible">
                {product.images.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    className={`relative h-[90px] w-[120px] overflow-hidden rounded-2xl border transition md:h-auto md:w-auto md:aspect-[4/3] md:min-w-0 ${
                      index === activeImageIndex
                        ? "border-zinc-900 shadow-[0_10px_24px_rgba(24,24,27,0.14)]"
                        : "border-transparent hover:border-zinc-300"
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className={`object-cover transition duration-300 ${
                        index === activeImageIndex ? "scale-105" : "scale-100"
                      }`}
                      sizes="160px"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-semibold leading-tight text-zinc-900 md:text-4xl">
                  {product.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-800">
                    {product.price} ₼
                  </span>
                  {product.discount ? (
                    <span className="rounded-full bg-[#d51414] px-3 py-1 text-sm font-semibold text-white">
                      {product.discount}% Endirim
                    </span>
                  ) : null}
                  <span
                    className={`rounded-full border px-3 py-1 text-sm font-medium ${
                      product.inStock
                        ? "border-green-600 text-green-700"
                        : "border-red-500 text-red-600"
                    }`}
                  >
                    {product.inStock ? "Stokda var" : "Stokda yoxdur"}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 text-sm text-zinc-600">
                <div className="space-y-3">
                  {descriptionBlocks.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-zinc-900 p-5 text-white shadow-[0_20px_50px_rgba(12,14,18,0.25)]">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-300">Sifariş</p>
                <h2 className="mt-2 text-xl font-semibold">Birbaşa sifariş verin</h2>
                <p className="mt-2 text-sm text-zinc-300">
                  Sifariş üçün detalları göndərin və ekspertlərimiz sizinlə əlaqə saxlasın.
                </p>
                <a
                  href={`https://wa.me/994503919290?text=${whatsappMessage}`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#d51414] px-4 py-2.5 text-sm font-semibold leading-none text-white transition hover:bg-[#b91111]"
                  target="_blank"
                  rel="noreferrer"
                >
                  İndi sifariş et
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="site-shell mt-2 space-y-8">
        <ServiceHighlights />
      </div>

      <div className="site-shell pb-12 pt-10">
        <SiteFooter />
      </div>
    </div>
  );
}
