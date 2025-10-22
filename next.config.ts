import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "randomuser.me",
      "plus.unsplash.com", // added new domain
    ],
  },
};

export default nextConfig;
