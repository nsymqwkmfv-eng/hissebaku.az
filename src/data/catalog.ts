import type { Category, Product } from "@/types/catalog";

export const categories: Category[] = [
  {
    id: "oils",
    title: "Yağlar",
    icon: "droplet",
    items: ["Mühərrik Yağları", "Transmissiya Yağları"],
  },
  {
    id: "cooling",
    title: "Maye sistemi",
    icon: "snowflake",
    items: ["Antifriz", "Qatqılar"],
  },
  {
    id: "brake-system",
    title: "Əyləc sistemi",
    icon: "disc",
    items: ["Əyləc bəndi", "Əyləc diski"],
  },
  {
    id: "filters",
    title: "Filtrlər",
    icon: "filter",
    items: ["Hava filtri", "Yağ filtri", "Yanacaq filtri"],
  },
  {
    id: "engine-parts",
    title: "Motor hissələri",
    icon: "engine",
    items: ["Kəmərlər", "Qatqılar", "Alışdırma şamları"],
  },
  {
    id: "suspension",
    title: "Asqı sistemi",
    icon: "suspension",
    items: ["Stabilizator", "Amortizator"],
  },
];

export const products: Product[] = [
  {
    id: "on-mercedes-benz-gle-w166-copy-copy",
    slug: "on-mercedes-benz-gle-w166-copy-copy",
    categoryId: "brake-system",
    title: "Ön, Mercedes-Benz GLE W166 Copy Copy",
    partType: "Əyləc Diski",
    description:
      "🔧 Brembo Brendi Sport Apornu Əyləc Diski – Mercedes-Benz GLE (W166) 2015-2018 modelləri üçün yüksək keyfiyyətli və etibarlı seçim! Ön TƏRƏF\n🚗 Yüksək performans və təhlükəsiz sürüş təmin edir, əyləc sisteminizi gücləndirir və uzunömürlü istifadə üçün mükəmməl həll.\n\n💰 Qiymət: 305 AZN Cütü\nStokda mövcuddur\nÇatdırılma mümkündür\n\nSifariş və əlavə məlumat üçün əlaqə saxlayın:",
    images: [
      {
        src: "https://framerusercontent.com/images/EuVO4jaYjzX0FnQh35FndI9oRF0.png",
        alt: "Ön, Mercedes-Benz GLE W166 Copy Copy - 1",
      },
      {
        src: "https://framerusercontent.com/images/OzOVVTGBYtg2HUpP0mkjGNCnAc.png",
        alt: "Ön, Mercedes-Benz GLE W166 Copy Copy - 2",
      },
      {
        src: "https://framerusercontent.com/images/zyyefJmo5BOvRw9Dp23xREtmxfc.png",
        alt: "Ön, Mercedes-Benz GLE W166 Copy Copy - 3",
      },
    ],
    price: 305,
    inStock: true,
  },
  {
    id: "shell-helix-4-l-5w30-copy",
    slug: "shell-helix-4-l-5w30-copy",
    categoryId: "oils",
    title: "Shell Helix, 4 l, 5w30 Copy",
    partType: "Mühərrik Yağları",
    description:
      "🛢️ Shell HELIX ULTRA 5W-30 mühərrik yağı – avtomobilinizin yüksək performansını qorumaq üçün mükəmməl seçim! 🚗 Bu yüksək keyfiyyətli yağ, mühərrikinizi təmiz saxlayaraq uzunmüddətli və etibarlı xidmət təmin edir.\n\n📏 Həcm: 4L\n\n✅ Orijinal Shell məhsulu\n✅ Yüksək performans və mühərrikinizi qorumaq üçün ideal seçim\n✅ Mühərrikin təmizliyini qoruyur və effektiv işləməsini təmin edir",
    images: [
      {
        src: "https://framerusercontent.com/images/KojyEnQnBY6SOeXlFoBt0SqYqk.png",
        alt: "Shell Helix, 4 l, 5w30 Copy - 1",
      },
    ],
    price: 76,
    inStock: false,
  },
  {
    id: "on-mercedes-benz-gle-w166-copy",
    slug: "on-mercedes-benz-gle-w166-copy",
    categoryId: "brake-system",
    title: "Ön, Mercedes-Benz GLE W166 Copy",
    partType: "Əyləc Diski",
    description:
      "🔧 Brembo Brendi Sport Apornu Əyləc Diski – Mercedes-Benz GLE (W166) 2015-2018 modelləri üçün yüksək keyfiyyətli və etibarlı seçim! Ön TƏRƏF\n🚗 Yüksək performans və təhlükəsiz sürüş təmin edir, əyləc sisteminizi gücləndirir və uzunömürlü istifadə üçün mükəmməl həll.\n\n💰 Qiymət: 305 AZN Cütü\nStokda mövcuddur\nÇatdırılma mümkündür\n\nSifariş və əlavə məlumat üçün əlaqə saxlayın:",
    images: [
      {
        src: "https://framerusercontent.com/images/EuVO4jaYjzX0FnQh35FndI9oRF0.png",
        alt: "Ön, Mercedes-Benz GLE W166 Copy - 1",
      },
      {
        src: "https://framerusercontent.com/images/OzOVVTGBYtg2HUpP0mkjGNCnAc.png",
        alt: "Ön, Mercedes-Benz GLE W166 Copy - 2",
      },
      {
        src: "https://framerusercontent.com/images/zyyefJmo5BOvRw9Dp23xREtmxfc.png",
        alt: "Ön, Mercedes-Benz GLE W166 Copy - 3",
      },
    ],
    price: 305,
    inStock: true,
  },
  {
    id: "on-jeep-grand-cherokee-2012-il-orijinal-yeni",
    slug: "on-jeep-grand-cherokee-2012-il-orijinal-yeni",
    categoryId: "brake-system",
    title: "Ön, Jeep Grand Cherokee, 2012 il, Orijinal, Yeni",
    partType: "Əyləc Sistemi",
    description:
      "🔧 Yüksək Keyfiyyətli Naklatka – Jeep Grand Cherokee 2010 modeli üçün ideal seçim!\n💪 Brembo brendi ilə təmin edilən bu ön naklatka, effektiv əyləc sistemi və uzunömürlü istifadə üçün yüksək performans təqdim edir.\n\n💰 Qiymət: 120 AZN\nStokda mövcuddur\nÇatdırılma mümkündür\n\nSifariş və əlavə məlumat üçün əlaqə saxlayın:\n📞 051 605 59 79\n📍 Bakı\n\nDaha çox məlumat və yeniliklər üçün bizi izləyin:\n👉 TikTok & Instagram: @hisse.baku",
    images: [
      {
        src: "https://framerusercontent.com/images/uH2eRYTKm9PRza9JKYWnn7tXRw.png",
        alt: "Ön, Jeep Grand Cherokee, 2012 il, Orijinal, Yeni - 1",
      },
      {
        src: "https://framerusercontent.com/images/9VEutNRUZJSLVtuzOOraYRsiw.png",
        alt: "Ön, Jeep Grand Cherokee, 2012 il, Orijinal, Yeni - 2",
      },
      {
        src: "https://framerusercontent.com/images/aVP8V6YqFX9He6LEPvkyyVU.png",
        alt: "Ön, Jeep Grand Cherokee, 2012 il, Orijinal, Yeni - 3",
      },
    ],
    price: 120,
    inStock: true,
    discount: 10,
  },
  {
    id: "shell-helix-4-l-5w30",
    slug: "shell-helix-4-l-5w30",
    categoryId: "oils",
    title: "Shell Helix, 4 l, 5w30",
    partType: "Mühərrik Yağları",
    description:
      "🛢️ Shell HELIX ULTRA 5W-30 mühərrik yağı – avtomobilinizin yüksək performansını qorumaq üçün mükəmməl seçim! 🚗 Bu yüksək keyfiyyətli yağ, mühərrikinizi təmiz saxlayaraq uzunmüddətli və etibarlı xidmət təmin edir.\n\n📏 Həcm: 4L\n\n✅ Orijinal Shell məhsulu\n✅ Yüksək performans və mühərrikinizi qorumaq üçün ideal seçim\n✅ Mühərrikin təmizliyini qoruyur və effektiv işləməsini təmin edir",
    images: [
      {
        src: "https://framerusercontent.com/images/KojyEnQnBY6SOeXlFoBt0SqYqk.png",
        alt: "Shell Helix, 4 l, 5w30 - 1",
      },
    ],
    price: 76,
    inStock: false,
  },
  {
    id: "on-nissan-t31-2010-il-yeni",
    slug: "on-nissan-t31-2010-il-yeni",
    categoryId: "brake-system",
    title: "Ön, Nissan T31 2010 il, Yeni",
    partType: "Əyləc Diski",
    description:
      "🔧 Brembo Brendi Apornu Əyləc Diski – Nissan X-Trail T31 2007-2012 və Nissan Qashqai 2007-2011 modelləri üçün ideal seçim!\n🚗 Yüksək performans və təhlükəsiz sürüş təmin edir, əyləc sisteminizi gücləndirir və uzunömürlü istifadə üçün mükəmməl həll.\n\n💰 Qiymət: 198 AZN (Cütü)\nStokda mövcuddur\nÇatdırılma mümkündür",
    images: [
      {
        src: "https://framerusercontent.com/images/3wAWUcAgRe6aEj2ozGziVNs9TU.png",
        alt: "Ön, Nissan T31 2010 il, Yeni - 1",
      },
      {
        src: "https://framerusercontent.com/images/ML8kwHEjWOmwYRca1tnqdkoHI.png",
        alt: "Ön, Nissan T31 2010 il, Yeni - 2",
      },
      {
        src: "https://framerusercontent.com/images/wZjVcjSUAMd72J9MFPdfALJESzw.png",
        alt: "Ön, Nissan T31 2010 il, Yeni - 3",
      },
    ],
    price: 198,
    inStock: true,
    discount: 25,
  },
  {
    id: "on-mercedes-benz-gle-w166-2015-il-yeni",
    slug: "on-mercedes-benz-gle-w166-2015-il-yeni",
    categoryId: "brake-system",
    title: "Ön, Mercedes-Benz GLE W166",
    partType: "Əyləc Diski",
    description:
      "🔧 Brembo Brendi Sport Apornu Əyləc Diski – Mercedes-Benz GLE (W166) 2015-2018 modelləri üçün yüksək keyfiyyətli və etibarlı seçim! Ön TƏRƏF\n🚗 Yüksək performans və təhlükəsiz sürüş təmin edir, əyləc sisteminizi gücləndirir və uzunömürlü istifadə üçün mükəmməl həll.\n\n💰 Qiymət: 305 AZN Cütü\nStokda mövcuddur\nÇatdırılma mümkündür\n\nSifariş və əlavə məlumat üçün əlaqə saxlayın:",
    images: [
      {
        src: "https://framerusercontent.com/images/EuVO4jaYjzX0FnQh35FndI9oRF0.png",
        alt: "Ön, Mercedes-Benz GLE W166 - 1",
      },
      {
        src: "https://framerusercontent.com/images/OzOVVTGBYtg2HUpP0mkjGNCnAc.png",
        alt: "Ön, Mercedes-Benz GLE W166 - 2",
      },
      {
        src: "https://framerusercontent.com/images/zyyefJmo5BOvRw9Dp23xREtmxfc.png",
        alt: "Ön, Mercedes-Benz GLE W166 - 3",
      },
    ],
    price: 305,
    inStock: true,
  },
];
