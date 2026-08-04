import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("dovrebbe unire classi condizionali risolvendo i conflitti Tailwind", () => {
    expect(cn("p-2", false && "p-4", "text-sm")).toBe("p-2 text-sm");
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
