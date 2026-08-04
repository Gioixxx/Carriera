import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { IdentityForm } from "./IdentityForm";

describe("IdentityForm", () => {
  it("dovrebbe mostrare errori di validazione se si conferma con campi mancanti", () => {
    const onSubmit = vi.fn();
    render(<IdentityForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: /conferma identità/i }));

    expect(screen.getByText(/inserisci un cognome/i)).toBeInTheDocument();
    expect(screen.getByText(/seleziona una nazionalità/i)).toBeInTheDocument();
    expect(screen.getByText(/seleziona un ruolo/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("dovrebbe segnalare un numero di maglia fuori dal range 1-99", () => {
    const onSubmit = vi.fn();
    render(<IdentityForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/^numero$/i), { target: { value: "150" } });
    fireEvent.click(screen.getByRole("button", { name: /conferma identità/i }));

    expect(screen.getByText(/il numero deve essere tra 1 e 99/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("dovrebbe chiamare onSubmit con l'identità corretta quando tutti i campi sono validi", () => {
    const onSubmit = vi.fn();
    render(<IdentityForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/cognome/i), { target: { value: "Rossi" } });
    fireEvent.change(screen.getByLabelText(/^numero$/i), { target: { value: "9" } });

    fireEvent.click(screen.getByRole("radio", { name: /sinistro/i }));

    fireEvent.click(screen.getByRole("button", { name: /^nazionalità$/i }));
    fireEvent.change(screen.getByPlaceholderText(/cerca…/i), { target: { value: "Italy" } });
    fireEvent.click(screen.getByRole("option", { name: /italy/i }));

    fireEvent.click(screen.getByRole("radio", { name: "ST" }));

    fireEvent.click(screen.getByRole("button", { name: /conferma identità/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      lastName: "Rossi",
      number: 9,
      foot: "left",
      nationality: "Italy",
      position: "ST",
    });
  });
});
