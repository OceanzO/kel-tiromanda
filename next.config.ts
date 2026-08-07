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
  async redirects() {
    return [
      {
        source: '/admin/login',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;