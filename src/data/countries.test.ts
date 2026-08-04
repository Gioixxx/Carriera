import { describe, expect, it } from "vitest";
import { countries } from "./countries";

describe("countries", () => {
  it("dovrebbe avere codici univoci", () => {
    const codes = countries.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("dovrebbe avere nomi univoci", () => {
    const names = countries.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("ogni paese dovrebbe avere una bandiera non vuota", () => {
    for (const country of countries) {
      expect(country.flag.length).toBeGreaterThan(0);
    }
  });

  it("dovrebbe includere le principali nazioni calcistiche usate nei dati dei club", () => {
    const names = countries.map((c) => c.name);
    expect(names).toEqual(
      expect.arrayContaining(["Italy", "England", "Spain", "Brazil"]),
    );
  });
});
