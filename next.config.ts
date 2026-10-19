import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `pg` must stay outside the bundle — it is a native/node-only driver.
  serverExternalPackages: ["pg"],
};

export default nextConfig;
