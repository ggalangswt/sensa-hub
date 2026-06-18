import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ["@sensa/sound"],
  turbopack: {
    root: path.resolve(process.cwd(), ".."),
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "wagmi",
      "viem",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-slider",
      "@radix-ui/react-switch",
    ],
  },
};

export default nextConfig;
