import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/product-detail-view";
import { supabase } from "@/lib/supabaseClient";
import type { Category, Product } from "@/types/catalog";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  if (!supabase) {
    notFound();
  }
  const rawSlug = decodeURIComponent(slug ?? "").toLowerCase();
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const normalizedSlug = normalize(rawSlug);
  const toCategory = (row: any): Category => ({
    id: row.id,
    title: row.title,
    icon: row.icon ?? "filter",
    items: Array.isArray(row.items) ? row.items : [],
  });

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

  const { data: productRows } = await supabase!
    .from("products")
    .select("*")
    .eq("slug", rawSlug)
    .limit(1);

  let productRow = productRows?.[0] ?? null;

  if (!productRow && rawSlug !== normalizedSlug) {
    const { data: normalizedRows } = await supabase!
      .from("products")
      .select("*")
      .eq("slug", normalizedSlug)
      .limit(1);
    productRow = normalizedRows?.[0] ?? null;
  }

  if (!productRow) {
    notFound();
  }

  const [{ data: categoryRows }, { data: allProductRows }] = await Promise.all([
    supabase!.from("categories").select("*"),
    supabase!.from("products").select("*"),
  ]);

  const categories: Category[] = (categoryRows ?? []).map(toCategory);
  const products: Product[] = (allProductRows ?? []).map(toProduct);
  const product = toProduct(productRow);

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailView
      product={product}
      categories={categories}
      products={products}
    />
  );
}
