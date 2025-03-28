import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_BASE_URL
        : 'http://localhost:3000'
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wscjryexgtlhtiqwfeck.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

};

export default nextConfig;
