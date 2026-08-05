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

### Nomi reali confederazione-specifici per i trofei di nazionale (Copa América, Asian Cup, ecc.)
- **Priorità:** Bassa
- **Tipo:** Miglioramento
- **Area:** dominio (`lib/career/trophies.ts`, `rollNationalTrophy`), dati (`data/countries.ts`)
- **Descrizione:** `rollNationalTrophy` oggi sceglie 50/50 tra solo `"Mondiale"`/`"Europei"`, indipendentemente dalla nazionalità del giocatore. Una sessione di ricerca sul gioco originale (Esplorazione aggiuntiva 3, poi confermata in Esplorazione 4) ha osservato/confermato che l'originale usa nomi reali specifici per confederazione (es. "Asian Cup" per nazionalità asiatiche) — l'Esplorazione 4 ha anche corretto un'assunzione precedente: l'originale usa sempre nomi di trofeo reali (World Cup, Copa América, Champions League, Europa League, Copa Libertadores, Copa Argentina, ecc.), mai un placeholder generico "Eurocup". La ricerca immagini 2026-08-05 ha già trovato badge TheSportsDB per 6 tornei di confederazione (`.claude/research/team-crests.md` sezione 5), pronti da usare quando si implementa la logica.
- **Criteri accettazione:** `rollNationalTrophy` sceglie il torneo in base alla confederazione derivata dalla nazionalità del giocatore (richiede aggiungere confederazione a `countries.ts`), badge corrispondente mostrato via `CompetitionBadge`/`COMPETITION_BADGES` (da estendere con le 6 voci già ricercate).
- **Perché rimandato:** tocca la logica di dominio (non solo la UI), decisione a parte rispetto all'integrazione immagini già fatta (che copre solo "Mondiale"/"Europei", le uniche stringhe che il dominio produce oggi).
- **Stima:** Media

## Priorità
- **Alta:** —
- **Media:** —
- **Bassa:** nomi reali confederazione-specifici per i trofei di nazionale (vedi sopra)

## Archiviato
- **Packaging come eseguibile .exe** — implementato 2026-08-05: launcher .NET/WebView2 (`launcher/CarrieraLauncher/`), committato come `dist/Carriera.exe`. Vedi [[decisions]] per la scelta tecnica e `launcher/README.md` per come rigenerarlo.
- **Integrazione stemmi club/competizioni e immagini premi via hotlink** — implementato 2026-08-05: `crestUrl` su ogni `Club` (84/84, TheSportsDB), `COMPETITION_BADGES` per campionati/coppe/coppe continentali/Mondiale/Europei, icona generica (Twemoji) per i 3 `AwardType` individuali — vedi [[decisions]] per il ragionamento sulla distinzione trademark club-vs-award.
