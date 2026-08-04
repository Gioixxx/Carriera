---
type: conventions
tags: [memory, conventions]
updated: [2026-08-04]
---

# Convenzioni Locali
Pattern e regole specifiche del progetto. Workaround che generano debito → [[tech-debt]].

## Lingua
- **Tutta l'interfaccia utente e i testi visibili sono in italiano** (richiesta esplicita dell'utente) — label, messaggi di errore, copy dei bottoni, nomi delle decisioni/eventi.
- Codice, commenti, nomi di variabili/funzioni restano in inglese come da standard.
- I nomi propri (club, competizioni, nazionalità) restano nella loro forma reale/originale (es. "Champions League", non tradotto).

## RNG testabile
- Ogni funzione del motore che usa casualità accetta un parametro `rng: Rng = Math.random` opzionale (tipo `() => number`), per permettere test deterministici passando un RNG finto. Pattern usato in `progression.ts`, `engine.ts`, `decisions.ts` — mantenerlo per ogni nuova funzione probabilistica.

## Struttura cartelle
- `lib/career/`: dominio puro, zero dipendenze da React — nessun file qui deve importare da `components/`.
- `components/ui/`: primitive generiche (Button, Card, Field, SegmentedControl) — nessuna logica di dominio.
- `components/features/career/`: componenti specifici del gioco, possono importare da `lib/career/` e `data/`.
- Test co-locati (`*.test.ts`/`*.test.tsx` accanto al file), mai in cartella `tests/` separata.

## Design tokens
- `constants/design-tokens.ts` è la fonte di verità TypeScript; `app/globals.css` duplica gli stessi valori come CSS custom properties (necessario per Tailwind v4 `@theme inline` + dark mode via classe). Se si cambia un colore, aggiornare **entrambi** i file.
- `--color-pitch` (verde campo) è **sempre verde**, non segue light/dark — usarlo per qualunque elemento che rappresenta un campo da calcio o una maglia. Non usare `--color-primary` per quello (cambia colore col tema).

## Vincoli noti
- Il piano di implementazione dettagliato vive fuori dal repo: `C:\Users\Gioix\.claude\plans\piped-bouncing-cocke.md` — leggerlo prima di riprendere lo sviluppo.
- Stemmi dei club: solo hotlink a URL esterni se mai implementati, mai download/salvataggio di loghi nel repo (rischio copyright su marchi registrati).
