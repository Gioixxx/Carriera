import { defineConfig } from "vitest/config";
import path from "path";

/**
 * Config separata per eseguire scripts/sync-league-rosters.ts a mano (`npm run sync-rosters`).
 * Non è inclusa nel vitest.config.mts principale: interroga una API esterna (TheSportsDB) per
 * confrontare i roster reali con data/clubs.ts, è uno strumento diagnostico manuale non un test
 * da CI (stesso pattern di vitest.simulate.config.mts).
 */
export default defineConfig({
  test: {
    include: ["scripts/sync-league-rosters.ts"],
    testTimeout: 120_000,
    hookTimeout: 120_000,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
