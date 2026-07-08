import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile the shared database package (it ships TypeScript source)
  transpilePackages: ["@irv-b/database"],
};

export default nextConfig;
