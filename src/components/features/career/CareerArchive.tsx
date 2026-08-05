import { Trophy as TrophyIcon } from "lucide-react";
import type { ArchivedCareer } from "@/types/career";
import { countries } from "@/data/countries";
import { Button } from "@/components/ui/Button";
import { CountryFlag } from "./CountryFlag";
import { OvrBadge } from "./OvrBadge";

interface CareerArchiveProps {
  entries: ArchivedCareer[];
  onBack: () => void;
}

const SAVINGS_FORMATTER = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function CareerArchive({ entries, onBack }: CareerArchiveProps) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-5 text-center">
      <div>
        <p className="font-display text-xs tracking-[0.3em] text-(--color-accent)">Archivio</p>
        <h2 className="font-display text-2xl text-(--color-text)">Le mie carriere</h2>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 rounded-lg border border-dashed border-(--color-border) px-6 py-8 text-center">
          <TrophyIcon size={20} aria-hidden="true" className="text-(--color-text-muted)/60" />
          <p className="text-sm text-(--color-text-muted)">Nessuna carriera conclusa finora.</p>
        </div>
      ) : (
        <div className="w-full min-w-0 rounded-xl border border-(--color-border) bg-(--color-surface) text-left shadow-sm">
          <ul className="divide-y divide-(--color-border)">
            {entries.map((entry) => {
              const country = countries.find((c) => c.name === entry.nationality);
              return (
                <li
                  key={entry.id}
                  className="flex flex-col gap-2 px-3 py-2.5 odd:bg-(--color-surface-raised)/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {country ? (
                      <CountryFlag
                        code={country.code}
                        name={country.name}
                        fallbackEmoji={country.flag}
                        size={16}
                      />
                    ) : null}
                    <span className="min-w-0 truncate font-medium text-(--color-text)">
                      {entry.lastName.toUpperCase()}
                    </span>
                    <span className="shrink-0 rounded bg-(--color-surface-raised) px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-(--color-text-muted) uppercase">
                      {entry.position}
                    </span>
                    <OvrBadge ovr={entry.peakOvr} size="sm" />
                  </div>
                  <p className="pl-6 text-xs text-(--color-text-muted) sm:pl-0">
                    Ritirato a {entry.retiredAge} anni · {entry.trophyCount}{" "}
                    {entry.trophyCount === 1 ? "trofeo" : "trofei"} · {entry.awardCount}{" "}
                    {entry.awardCount === 1 ? "premio" : "premi"} ·{" "}
                    {SAVINGS_FORMATTER.format(entry.finalSavingsEur)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <Button variant="secondary" onClick={onBack}>
        Torna
      </Button>
    </div>
  );
}
