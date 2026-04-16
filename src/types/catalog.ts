export type Category = {
  id: string;
  title: string;
  icon: string;
  items: string[];
};

export type Product = {
  id: string;
  slug: string;
  categoryId: string;
  title: string;
  partType: string;
  description: string;
  images: Array<{
    src: string;
    alt: string;
  }>;
  price: number;
  discount?: number;
  inStock: boolean;
};
