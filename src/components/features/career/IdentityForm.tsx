"use client";

import { useState } from "react";
import type { PlayerIdentity, Position, PreferredFoot } from "@/types/career";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { countries } from "@/data/countries";
import { JerseyCard } from "./JerseyCard";
import { NationalitySelect } from "./NationalitySelect";
import { PositionPicker } from "./PositionPicker";

interface IdentityFormProps {
  onSubmit: (identity: PlayerIdentity) => void;
}

interface FormErrors {
  lastName?: string;
  number?: string;
  nationality?: string;
  position?: string;
}

export function IdentityForm({ onSubmit }: IdentityFormProps) {
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState<number | null>(10);
  const [foot, setFoot] = useState<PreferredFoot>("right");
  const [nationality, setNationality] = useState<string | null>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const flag = countries.find((c) => c.name === nationality)?.flag;

  function handleSubmit() {
    const nextErrors: FormErrors = {};
    if (!lastName.trim()) nextErrors.lastName = "Inserisci un cognome.";
    if (!number || number < 1 || number > 99) {
      nextErrors.number = "Il numero deve essere tra 1 e 99.";
    }
    if (!nationality) nextErrors.nationality = "Seleziona una nazionalità.";
    if (!position) nextErrors.position = "Seleziona un ruolo in campo.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      lastName: lastName.trim(),
      number: number as number,
      foot,
      nationality: nationality as string,
      position: position as Position,
    });
  }

  return (
    <div className="grid gap-8 md:grid-cols-[auto_1fr]">
      <div className="md:sticky md:top-8 md:self-start">
        <JerseyCard lastName={lastName} number={number} flag={flag} />
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-[1fr_5rem] gap-4">
          <Field label="Cognome" htmlFor="last-name" error={errors.lastName}>
            <input
              id="last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              maxLength={15}
              placeholder="Es. Rossi"
              className="rounded-md border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
            />
          </Field>
          <Field label="Numero" htmlFor="number" error={errors.number}>
            <input
              id="number"
              type="number"
              min={1}
              max={99}
              value={number ?? ""}
              onChange={(e) => setNumber(e.target.value ? Number(e.target.value) : null)}
              className="rounded-md border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
            />
          </Field>
        </div>

        <Field label="Piede preferito">
          <SegmentedControl
            name="Piede preferito"
            value={foot}
            onChange={setFoot}
            options={[
              { value: "left", label: "Sinistro" },
              { value: "right", label: "Destro" },
            ]}
          />
        </Field>

        <Field label="Nazionalità" htmlFor="nationality" error={errors.nationality}>
          <NationalitySelect id="nationality" value={nationality} onChange={setNationality} />
        </Field>

        <Field label="Ruolo in campo" error={errors.position}>
          <PositionPicker value={position} onChange={setPosition} />
        </Field>

        <Button onClick={handleSubmit} className="self-start">
          Conferma identità
        </Button>
      </div>
    </div>
  );
}
