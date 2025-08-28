import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "m4cet3r3w5.ufs.sh",
      },
    ],

  },
};

export default nextConfig;
