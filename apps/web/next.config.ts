import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Los paquetes internos se exponen como TypeScript fuente y los compila Next.
  transpilePackages: ["@ptt/db", "@ptt/shared", "@ptt/typing-engine"],
};

export default nextConfig;
