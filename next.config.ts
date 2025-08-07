import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pages部署配置
  basePath: '/tupianqiangtupianfenge',
  assetPrefix: '/tupianqiangtupianfenge/',
};

export default nextConfig;
