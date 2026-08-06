import { defineConfig } from "vitest/config";
import path from "path";

/**
 * Config separata per eseguire scripts/simulate-careers.ts a mano (`npm run simulate`).
 * Non è inclusa nel vitest.config.mts principale: girare migliaia di carriere con
 * Math.random reale è uno strumento di taratura manuale, non un test da CI.
 */
export default defineConfig({
  test: {
    include: ["scripts/simulate-careers.ts"],
    testTimeout: 120_000,
    hookTimeout: 120_000,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
