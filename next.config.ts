import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Ignore ESLint errors during build (so "any" and unused vars don’t block)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Export static HTML (creates `out/` folder for Android WebView)
  output: "export",

  // ✅ Fix for Next.js <Image> when exporting
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
