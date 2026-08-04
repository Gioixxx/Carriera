"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { countries } from "@/data/countries";
import { cn } from "@/lib/utils";

interface NationalitySelectProps {
  value: string | null;
  onChange: (countryName: string) => void;
  id?: string;
}

export function NationalitySelect({ value, onChange, id }: NationalitySelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = countries.find((c) => c.name === value) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between rounded-md border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)",
        )}
      >
        {selected ? (
          <span className="flex items-center gap-2">
            <span aria-hidden="true">{selected.flag}</span>
            {selected.name}
          </span>
        ) : (
          <span className="text-(--color-text-muted)">Cerca un paese…</span>
        )}
        <span aria-hidden="true" className="text-(--color-text-muted)">
          ▾
        </span>
      </button>

      {open ? (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-(--color-border) bg-(--color-surface) shadow-lg">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            placeholder="Cerca…"
            aria-label="Cerca nazionalità"
            className="w-full border-b border-(--color-border) px-3 py-2 text-sm outline-none"
          />
          <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-(--color-text-muted)">Nessun risultato.</li>
            ) : (
              filtered.map((c) => (
                <li key={c.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={c.name === value}
                    onClick={() => {
                      onChange(c.name);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-(--color-surface-raised)",
                      c.name === value && "bg-(--color-surface-raised) font-semibold",
                    )}
                  >
                    <span aria-hidden="true">{c.flag}</span>
                    {c.name}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
