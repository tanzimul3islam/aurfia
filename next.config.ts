import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: [
    'kysely',
    '@better-auth/kysely-adapter',
    'better-sqlite3',
  ],
};

export default nextConfig;
