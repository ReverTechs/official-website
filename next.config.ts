import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Increase body size limit for file uploads (500MB for route handlers)
  experimental: {
    proxyClientMaxBodySize: '500mb',
  },
};

export default nextConfig;
