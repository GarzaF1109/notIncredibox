import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true, // <-- Esto permite imágenes en modo estático
  },
};

export default nextConfig;
