import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export statico: il gioco è interamente client-side (nessuna API route/middleware),
  // serve a produrre gli asset per il launcher desktop (vedi launcher/).
  output: "export",
};

export default nextConfig;
