import type { Metadata } from "next";
import { Manrope, Poppins, Space_Grotesk, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const sora = Sora({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hissebaku.az"),
  title: {
    default: "Hissə Baku | Avto Ehtiyat Hissələri",
    template: "%s | Hissə Baku",
  },
  description:
    "Orijinal avto hissələri, rəsmi zəmanət və sürətli çatdırılma. Hissə Baku-da avtomobiliniz üçün doğru hissəni seçin.",
  openGraph: {
    type: "website",
    locale: "az_AZ",
    url: "https://hissebaku.az",
    title: "Hissə Baku | Avto Ehtiyat Hissələri",
    description:
      "Orijinal avto hissələri, rəsmi zəmanət və sürətli çatdırılma. Hissə Baku-da avtomobiliniz üçün doğru hissəni seçin.",
    images: [
      {
        url: "https://github.com/nsymqwkmfv-eng/hissebaku.az/blob/main/public/WEBTHUMBNAIL.jpg?raw=true",
        width: 1200,
        height: 630,
        alt: "Hissə Baku",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hissə Baku | Avto Ehtiyat Hissələri",
    description:
      "Orijinal avto hissələri, rəsmi zəmanət və sürətli çatdırılma. Hissə Baku-da avtomobiliniz üçün doğru hissəni seçin.",
    images: ["https://github.com/nsymqwkmfv-eng/hissebaku.az/blob/main/public/WEBTHUMBNAIL.jpg?raw=true"],
  },
  icons: {
    icon: [
      { url: "/hissebak2.png", type: "image/png" },
      { url: "/hissebak2.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: ["/hissebak2.png"],
    apple: [{ url: "/hissebak2.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="az"
      className={`${sora.variable} ${spaceGrotesk.variable} ${poppins.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
