import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    localPatterns: [
      {
        pathname: "/api/images",
      },
      {
        pathname: "/svgs/*",
      },
      {
        pathname: "/*",
      },
    ],
  },
};

export default nextConfig;
