import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/catalog";

type ProductCardProps = {
  product: Product;
  index?: number;
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <article
      className="dashboard-reveal group flex h-full flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_10px_24px_rgba(24,24,27,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(24,24,27,0.12)]"
      style={{ animationDelay: `${160 + index * 70}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={product.images[0]?.src ?? ""}
          alt={product.images[0]?.alt ?? product.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,14,18,0.35),rgba(12,14,18,0.02))]" />

        {product.discount ? (
          <span className="absolute left-3 top-3 rounded-full bg-[#d51414] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white">
            {product.discount}% ENDİRİM
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5 font-[var(--font-poppins)]">
        <div className="space-y-2.5">
          <h3 className="line-clamp-2 min-h-[48px] break-words font-[var(--font-sans)] text-lg font-semibold leading-tight text-zinc-900">
            {product.title}
          </h3>

          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-zinc-500">
            {product.partType}
          </p>

          <div className="flex items-center justify-between gap-2">
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                product.inStock
                  ? "border-green-600 text-green-700"
                  : "border-red-500 text-red-600"
              }`}
            >
              {product.inStock ? "Stokda var" : "Stokda yoxdur"}
            </span>

            <span className="text-[10px] font-medium text-zinc-400">
              #{index + 101}
            </span>
          </div>
        </div>

        <footer className="mt-auto flex min-h-[42px] items-center gap-2 pt-1">
          <span className="rounded-lg bg-zinc-100 px-3 py-1.5 text-base font-semibold text-zinc-800">
            {product.price} ₼
          </span>
          <Link
            href={`/products/${encodeURIComponent(product.slug ?? product.id)}`}
            className="group/cta relative ml-auto inline-flex items-center gap-1.5 overflow-hidden rounded-lg border border-zinc-900 bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:border-[#d51414] hover:shadow-[0_10px_20px_rgba(213,20,20,0.25)]"
          >
            <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.2),transparent)] transition duration-500 group-hover/cta:translate-x-full" />
            <span className="relative">Ətraflı bax</span>
            <ArrowUpRight className="relative size-3.5 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
          </Link>
        </footer>
      </div>
    </article>
  );
}
