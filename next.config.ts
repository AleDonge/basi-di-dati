import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false, devIndicators: false, turbopack: { root: process.cwd() },
  async headers() { return [{ source: "/algebra/algebra-worker.js", headers: [{ key: "Content-Security-Policy", value: "default-src 'none'; script-src 'self'; connect-src 'none'; worker-src 'none'" }, { key: "X-Content-Type-Options", value: "nosniff" }] }, { source: "/sql/sql-worker.js", headers: [{ key: "Content-Security-Policy", value: "default-src 'none'; script-src 'self' 'wasm-unsafe-eval'; connect-src 'none'; worker-src 'none'" }, { key: "X-Content-Type-Options", value: "nosniff" }] }]; },
};
export default config;
