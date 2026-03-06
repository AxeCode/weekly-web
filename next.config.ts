import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 将 'export' 改为 'standalone'
  output: 'standalone', 
  images: {
    unoptimized: true,
  },
};

export default nextConfig;