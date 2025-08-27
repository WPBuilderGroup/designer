import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable all dev overlay features that cause launch editor requests
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Disable dev indicators completely  
  devIndicators: false,
};

export default nextConfig;
