import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kelurahan Tiromanda — Portal Resmi",
  description:
    "Portal resmi Kelurahan Tiromanda, Kecamatan Makale Selatan, Kabupaten Tana Toraja, Sulawesi Selatan. Temukan informasi pemerintahan, potensi wisata, UMKM, fasilitas, dan layanan masyarakat.",
  keywords: [
    "Kelurahan Tiromanda",
    "Tana Toraja",
    "Makale Selatan",
    "Toraja",
    "wisata Toraja",
    "pemerintah desa",
    "UMKM Toraja",
    "Tongkonan",
    "Sulawesi Selatan",
  ],
  authors: [{ name: "Kelurahan Tiromanda" }],
  openGraph: {
    title: "Kelurahan Tiromanda — Portal Pemerintahan & Wisata Desa",
    description:
      "Temukan keindahan alam, budaya lokal, dan komunitas Tiromanda, Tana Toraja.",
    type: "website",
    locale: "id_ID",
    siteName: "Kelurahan Tiromanda",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    google: "notranslate",
  },
};

import BackToTop from "@/components/ui/BackToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      translate="no"
      className={`${playfair.variable} ${inter.variable} antialiased notranslate`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground font-body">
        <LanguageProvider>
          {children}
          <BackToTop />
        </LanguageProvider>
      </body>
    </html>
  );
}
