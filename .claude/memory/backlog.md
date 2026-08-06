---
type: backlog
tags: [memory, backlog]
updated: [2026-08-04]
---

# Backlog
Funzionalità e idee a lungo termine. Prioritizzato pre-sprint → confluisce in [[sprint]].

## Template
### [Titolo breve]
- **Priorità:** Alta / Media / Bassa
- **Tipo:** Feature / Miglioramento / Refactor / Bug
- **Area:** [modulo/dominio]
- **Descrizione:** [valore atteso]
- **Criteri accettazione:** [come capire che è fatto]
- **Stima:** Piccola / Media / Grande

---

## Priorità
- **Alta:** —
- **Media:** —
- **Bassa:** —

## Archiviato
- **Packaging come eseguibile .exe** — implementato 2026-08-05: launcher .NET/WebView2 (`launcher/CarrieraLauncher/`), committato come `dist/Carriera.exe`. Vedi [[decisions]] per la scelta tecnica e `launcher/README.md` per come rigenerarlo.
- **Integrazione stemmi club/competizioni e immagini premi via hotlink** — implementato 2026-08-05: `crestUrl` su ogni `Club` (84/84, TheSportsDB), `COMPETITION_BADGES` per campionati/coppe/coppe continentali/Mondiale/Europei, icona generica (Twemoji) per i 3 `AwardType` individuali — vedi [[decisions]] per il ragionamento sulla distinzione trademark club-vs-award.
- **Nomi reali confederazione-specifici per i trofei di nazionale** — implementato 2026-08-06: nuovo campo `confederation` su `Country` (`data/countries.ts`, `getCountry()`), `rollNationalTrophy` sceglie tra "Mondiale" e il torneo di confederazione corretto (Europei/Copa América/AFC Asian Cup/Africa Cup of Nations/CONCACAF Gold Cup), 4 nuovi badge in `competition-badges.ts` con gli URL TheSportsDB già ricercati. Vedi [[decisions]].
