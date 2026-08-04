import "@testing-library/jest-dom/vitest";

// Silenzia l'ExperimentalWarning di Node sulla webstorage nativa non configurata (vedi sotto) —
// puro rumore in console, non un problema reale.
process.removeAllListeners("warning");

/**
 * jsdom 30 su Node 22+ lascia `window.localStorage` undefined quando la webstorage nativa di
 * Node non è configurata (flag sperimentale, non serve in produzione/browser reale). Polyfill
 * minimale solo per i test, cablato su window così anche il codice applicativo lo trova.
 */
if (typeof window !== "undefined" && !window.localStorage) {
  class MemoryStorage implements Storage {
    private store = new Map<string, string>();

    get length() {
      return this.store.size;
    }

    clear(): void {
      this.store.clear();
    }

    getItem(key: string): string | null {
      return this.store.has(key) ? this.store.get(key)! : null;
    }

    key(index: number): string | null {
      return Array.from(this.store.keys())[index] ?? null;
    }

    removeItem(key: string): void {
      this.store.delete(key);
    }

    setItem(key: string, value: string): void {
      this.store.set(key, String(value));
    }
  }

  Object.defineProperty(window, "localStorage", {
    value: new MemoryStorage(),
    configurable: true,
  });
}
