import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_BASE_PATH: process.env.GITHUB_ACTIONS ? "/oo2026" : "" },
  output: "export",
  basePath: process.env.GITHUB_ACTIONS ? "/oo2026" : "",
  assetPrefix: process.env.GITHUB_ACTIONS ? "/oo2026/" : "",
  trailingSlash: true,
};

export default nextConfig;
