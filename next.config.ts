import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    qualities: [75, 100], // Tambahan agar Next.js mengizinkan render gambar HD
  },
};

export default nextConfig;