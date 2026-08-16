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
  metadataBase: new URL("https://tiromanda.tanatorajakab.go.id"),
  title: {
    default: "Kelurahan Tiromanda",
    template: "%s | Kelurahan Tiromanda"
  },
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
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  other: {
    google: "notranslate",
  },
  icons: {
    icon: "/logo-toraja-baru.png",
    shortcut: "/logo-toraja-baru.png",
    apple: "/logo-toraja-baru.png",
  },
};



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

        </LanguageProvider>
      </body>
    </html>
  );
}
