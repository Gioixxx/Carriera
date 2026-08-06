export type Confederation = "UEFA" | "CONMEBOL" | "CONCACAF" | "CAF" | "AFC";

export interface Country {
  /** Codice ISO 3166-1 alpha-2 (dove esiste — le nazionali britanniche non sono paesi ISO). */
  code: string;
  name: string;
  flag: string;
  /** Confederazione calcistica di appartenenza, usata per il trofeo continentale di nazionale. */
  confederation: Confederation;
}

/**
 * Elenco curato delle nazionalità selezionabili in creazione personaggio. Non è l'elenco
 * esaustivo di tutti i paesi del mondo (come nel gioco originale) ma copre le principali
 * nazioni calcistiche — sufficiente per varietà reale senza dover mantenere ~200 voci.
 */
export const countries: Country[] = [
  { code: "IT", name: "Italy", flag: "🇮🇹", confederation: "UEFA" },
  { code: "ES", name: "Spain", flag: "🇪🇸", confederation: "UEFA" },
  { code: "FR", name: "France", flag: "🇫🇷", confederation: "UEFA" },
  { code: "DE", name: "Germany", flag: "🇩🇪", confederation: "UEFA" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", confederation: "UEFA" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", confederation: "UEFA" },
  { code: "BE", name: "Belgium", flag: "🇧🇪", confederation: "UEFA" },
  { code: "GB-ENG", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", confederation: "UEFA" },
  { code: "GB-SCT", name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", confederation: "UEFA" },
  { code: "GB-WLS", name: "Wales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", confederation: "UEFA" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", confederation: "UEFA" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", confederation: "UEFA" },
  { code: "AT", name: "Austria", flag: "🇦🇹", confederation: "UEFA" },
  { code: "PL", name: "Poland", flag: "🇵🇱", confederation: "UEFA" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", confederation: "UEFA" },
  { code: "NO", name: "Norway", flag: "🇳🇴", confederation: "UEFA" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", confederation: "UEFA" },
  { code: "HR", name: "Croatia", flag: "🇭🇷", confederation: "UEFA" },
  { code: "RS", name: "Serbia", flag: "🇷🇸", confederation: "UEFA" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦", confederation: "UEFA" },
  { code: "TR", name: "Turkey", flag: "🇹🇷", confederation: "UEFA" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", confederation: "CONMEBOL" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", confederation: "CONMEBOL" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾", confederation: "CONMEBOL" },
  { code: "CO", name: "Colombia", flag: "🇨🇴", confederation: "CONMEBOL" },
  { code: "CL", name: "Chile", flag: "🇨🇱", confederation: "CONMEBOL" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾", confederation: "CONMEBOL" },
  { code: "PE", name: "Peru", flag: "🇵🇪", confederation: "CONMEBOL" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨", confederation: "CONMEBOL" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", confederation: "CONCACAF" },
  { code: "US", name: "United States", flag: "🇺🇸", confederation: "CONCACAF" },
  { code: "CA", name: "Canada", flag: "🇨🇦", confederation: "CONCACAF" },
  { code: "MA", name: "Morocco", flag: "🇲🇦", confederation: "CAF" },
  { code: "SN", name: "Senegal", flag: "🇸🇳", confederation: "CAF" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", confederation: "CAF" },
  { code: "GH", name: "Ghana", flag: "🇬🇭", confederation: "CAF" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", confederation: "CAF" },
  { code: "CI", name: "Ivory Coast", flag: "🇨🇮", confederation: "CAF" },
  { code: "JP", name: "Japan", flag: "🇯🇵", confederation: "AFC" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", confederation: "AFC" },
  { code: "AU", name: "Australia", flag: "🇦🇺", confederation: "AFC" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", confederation: "AFC" },
  { code: "QA", name: "Qatar", flag: "🇶🇦", confederation: "AFC" },
];

export function getCountry(name: string): Country | undefined {
  return countries.find((c) => c.name === name);
}
