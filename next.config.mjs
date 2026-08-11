/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/TaValendo",
  assetPrefix: "/TaValendo",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
