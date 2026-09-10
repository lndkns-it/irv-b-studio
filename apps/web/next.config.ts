import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl =  createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Transpile the shared database package (it ships TypeScript source)
  transpilePackages: ["@irv-b/database", "@irv-b/queue"],
};

export default withNextIntl(nextConfig);
