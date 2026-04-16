"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/catalog";

type ProductCardProps = {
  product: Product;
  index?: number;
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const primaryImage = product.images[0];
  const imageSrc = primaryImage?.src;
  const router = useRouter();
  const href = `/products/${encodeURIComponent(product.slug ?? product.id)}`;
  const handlePrefetch = useCallback(() => {
    router.prefetch(href);
  }, [router, href]);

  return (
    <Link
      href={href}
      aria-label={`${product.title} detallarına bax`}
      className="dashboard-reveal group block h-full"
      style={{ animationDelay: `${160 + index * 70}ms` }}
      prefetch
      onPointerEnter={handlePrefetch}
      onFocus={handlePrefetch}
      onTouchStart={handlePrefetch}
    >
      <article className="relative flex h-full flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_10px_24px_rgba(24,24,27,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(24,24,27,0.12)] md:rounded-[18px]">
        <div className="relative aspect-[16/10] overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={primaryImage?.alt ?? product.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-xs font-semibold text-zinc-400">
            Şəkil yoxdur
          </div>
        )}

        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,14,18,0.35),rgba(12,14,18,0.02))]" />

        {product.discount ? (
          <span className="absolute left-2 top-2 rounded-full bg-[#d51414] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white md:left-3 md:top-3 md:px-2.5 md:py-1 md:text-[9px] md:tracking-[0.14em]">
            {product.discount}% ENDİRİM
          </span>
        ) : null}
      </div>

        <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5 font-[var(--font-poppins)] md:px-4 md:pb-4 md:pt-3.5">
          <div className="space-y-1.5 md:space-y-2.5">
          <h3 className="line-clamp-2 min-h-[36px] break-words font-[var(--font-sans)] text-[14px] font-semibold leading-snug text-zinc-900 md:min-h-[48px] md:text-lg md:leading-tight">
            {product.title}
          </h3>

          <p className="text-[8px] font-medium uppercase tracking-[0.08em] text-zinc-500 md:text-[10px]">
            {product.partType}
          </p>

          <div className="flex items-center justify-between gap-2">
            <span
              className={`rounded-full border px-2 py-0.5 text-[8px] font-medium md:px-2.5 md:py-1 md:text-[10px] ${
                product.inStock
                  ? "border-green-600 text-green-700"
                  : "border-red-500 text-red-600"
              }`}
            >
              {product.inStock ? "Stokda var" : "Stokda yoxdur"}
            </span>

            <span className="text-[8px] font-medium text-zinc-400 md:text-[10px]">
              #{index + 101}
            </span>
          </div>
        </div>

          <footer className="mt-auto flex min-h-[34px] items-center gap-2 pt-1 md:min-h-[42px]">
            <span className="w-full rounded-lg bg-zinc-100 px-2 py-1 text-[13px] font-semibold text-zinc-800 md:w-auto md:px-3 md:py-1.5 md:text-base">
              {product.price} ₼
            </span>
            <span
              className="group/cta relative ml-auto hidden items-center gap-1.5 overflow-hidden rounded-lg border border-zinc-900 bg-zinc-900 px-2.5 py-1 text-[12px] font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:border-[#d51414] hover:shadow-[0_10px_20px_rgba(213,20,20,0.25)] md:inline-flex md:px-3.5 md:py-2 md:text-sm"
            >
              <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.2),transparent)] transition duration-500 group-hover/cta:translate-x-full" />
              <span className="relative">Ətraflı bax</span>
              <ArrowUpRight className="relative size-3.5 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
            </span>
          </footer>
        </div>
      </article>
    </Link>
  );
}
