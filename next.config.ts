import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "down-vn.img.susercontent.com" },
      { protocol: "https", hostname: "sg-11134275-8260s.susercontent.com" },
      { protocol: "https", hostname: "nhatminhlaptop.com" },
      { protocol: "https", hostname: "cdn2.cellphones.com.vn" },
    ],
  },
};

export default nextConfig;
