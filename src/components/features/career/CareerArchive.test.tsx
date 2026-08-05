import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ArchivedCareer } from "@/types/career";
import { CareerArchive } from "./CareerArchive";

function sampleEntry(overrides: Partial<ArchivedCareer> = {}): ArchivedCareer {
  return {
    id: "rossi-1",
    lastName: "Rossi",
    nationality: "Italy",
    position: "ST",
    peakOvr: 88,
    trophyCount: 3,
    awardCount: 1,
    retiredAge: 38,
    retiredAtIso: new Date("2026-01-01").toISOString(),
    careerApps: 400,
    careerGoals: 200,
    careerAssists: 50,
    finalSavingsEur: 5_000_000,
    finalPopularity: 70,
    ...overrides,
  };
}

describe("CareerArchive", () => {
  it("dovrebbe mostrare un messaggio quando l'archivio è vuoto", () => {
    render(<CareerArchive entries={[]} onBack={vi.fn()} />);
    expect(screen.getByText(/nessuna carriera conclusa/i)).toBeInTheDocument();
  });

  it("dovrebbe elencare le carriere archiviate con i dati principali", () => {
    render(<CareerArchive entries={[sampleEntry()]} onBack={vi.fn()} />);
    expect(screen.getByText("ROSSI")).toBeInTheDocument();
    expect(screen.getByText(/ritirato a 38 anni/i)).toBeInTheDocument();
    expect(screen.getByText(/3 trofei/i)).toBeInTheDocument();
  });

  it("dovrebbe chiamare onBack quando si clicca 'Torna'", () => {
    const onBack = vi.fn();
    render(<CareerArchive entries={[sampleEntry()]} onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: /torna/i }));
    expect(onBack).toHaveBeenCalled();
  });
});
