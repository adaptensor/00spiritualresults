import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
};

export default nextConfig;
