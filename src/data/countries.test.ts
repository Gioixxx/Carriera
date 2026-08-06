import { describe, expect, it } from "vitest";
import { countries, getCountry } from "./countries";

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

  it("ogni paese dovrebbe avere una confederazione valorizzata", () => {
    const validConfederations = ["UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC"];
    for (const country of countries) {
      expect(validConfederations).toContain(country.confederation);
    }
  });
});

describe("getCountry", () => {
  it("dovrebbe trovare un paese per nome esatto", () => {
    expect(getCountry("Brazil")?.confederation).toBe("CONMEBOL");
    expect(getCountry("Italy")?.confederation).toBe("UEFA");
  });

  it("dovrebbe restituire undefined per un nome sconosciuto", () => {
    expect(getCountry("Narnia")).toBeUndefined();
  });
});
