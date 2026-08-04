export interface Country {
  /** Codice ISO 3166-1 alpha-2 (dove esiste — le nazionali britanniche non sono paesi ISO). */
  code: string;
  name: string;
  flag: string;
}

/**
 * Elenco curato delle nazionalità selezionabili in creazione personaggio. Non è l'elenco
 * esaustivo di tutti i paesi del mondo (come nel gioco originale) ma copre le principali
 * nazioni calcistiche — sufficiente per varietà reale senza dover mantenere ~200 voci.
 */
export const countries: Country[] = [
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "GB-ENG", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { code: "GB-SCT", name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { code: "GB-WLS", name: "Wales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "RS", name: "Serbia", flag: "🇷🇸" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "SN", name: "Senegal", flag: "🇸🇳" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "CI", name: "Ivory Coast", flag: "🇨🇮" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
];
