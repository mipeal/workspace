import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // Enable dev tools in development mode
    NEXT_PUBLIC_SHOW_DEVTOOLS: process.env.NODE_ENV === 'development' ? 'true' : 'false',
  }
};

export default nextConfig;
