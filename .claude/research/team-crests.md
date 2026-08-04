# Stemmi club e competizioni — URL hotlink (TheSportsDB)

> Ricerca di sola lettura. Nessuna immagine è stata scaricata: tutti i valori sotto sono URL
> pubblici testuali pensati per l'uso in `<img src="...">` (hotlink). Fonte primaria:
> [TheSportsDB](https://www.thesportsdb.com/api.php) — API JSON pubblica.
> Dati raccolti il 2026-08-04 interrogando `https://www.thesportsdb.com/api/v1/json/123/...`.

## 1. Termini d'uso — riepilogo e citazioni

Fonti lette direttamente: [Terms of Use](https://www.thesportsdb.com/docs_terms_of_use.php),
[api.php](https://www.thesportsdb.com/api.php), [free_sports_api](https://www.thesportsdb.com/free_sports_api),
[documentation](https://www.thesportsdb.com/documentation).

- **Chiave API pubblica di test**: la doc attuale (agosto 2026) dichiara esplicitamente
  *"The current free API key is: **123**"*. La chiave `3` citata in vecchie guide/esempi in giro
  per il web **non è più quella corrente** — usare `123` (o registrarsi per una chiave dedicata,
  vedi sotto). Non risulta un obbligo di account per usare la chiave pubblica `123` sugli endpoint
  v1 di lettura.
- **Rate limit**: *"Free users 30 requests per minute."* Nessun limite giornaliero dichiarato sulla
  pagina.
- **Uso gratuito — cosa è permesso**: *"You may use our API to lookup data and artwork for your
  development projects."* → hotlink di badge/artwork in un progetto in sviluppo è coperto.
- **Vincolo importante sulla pubblicazione**: *"You cannot publish apps to an appstore unless you
  are a paid subscriber."* Questo vincolo parla esplicitamente di pubblicazione su **app store**
  (Apple/Google). Non è chiaro se un'app web/browser-based (non distribuita su store) rientri in
  questa restrizione — la formulazione letterale la esclude, ma è un'area grigia che l'utente
  dovrebbe valutare prima di lanciare pubblicamente il progetto. Se in futuro l'app verrà
  impacchettata per uno store, serve l'abbonamento a pagamento ($9/mese via Patreon, che dà anche
  "a dedicated production API key" e accesso alla V2 API).
- **Artwork e attribuzione**: per artwork "custom" del sito, *"you must not pass it off as your
  own and should link back to our website where appropriate."* Per i loghi sportivi ufficiali
  (marchi registrati, cioè esattamente il caso degli stemmi club): *"Any trademarked sports logos
  must be used 'As is' and should not be modifed in any way."* — quindi niente ricolorazioni/crop
  dei badge dei club.
- **Copyright/trademark notice**: *"You also cannot remove or alter any copyright or trademark
  notices."*
- **Scraping**: *"You can scrape, copy and modify any content returned from the API, as long as
  you use the official end points. Please do not scrape our website."* — quindi va bene leggere i
  JSON degli endpoint ufficiali, non va bene fare scraping HTML del sito.
- **Rivendita**: *"You cannot resell our API in any way without specific permission."*
- **Licenza per-immagine**: esiste un tag `strCreativeCommons` sull'artwork dei giocatori per
  verificarne la licenza CC — non presente sui badge dei club nei payload controllati qui.

**In sintesi per l'utente**: per un progetto hobbistico/fan-made in sviluppo, in hotlink, non
pubblicato su app store, l'uso della chiave pubblica `123` per leggere badge di squadre e leghe
sembra coperto dai termini attuali. Da tenere a mente: rate limit 30 req/min, badge "as is" senza
modifiche, link di attribuzione "where appropriate", e la clausola sull'app store se in futuro si
distribuisce l'app tramite store.

## 2. Club — URL stemma

Tutti gli 84 club di `src/data/clubs.ts` sono stati trovati su TheSportsDB. Endpoint usato:
`GET https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=<nome>`.
Colonna "TSDB idTeam" = id squadra su TheSportsDB (utile per richieste future, es. lookup diretto).

### Italia — Serie A

| id club | Nome | TSDB idTeam | URL stemma |
|---|---|---|---|
| juventus | Juventus | 133676 | https://r2.thesportsdb.com/images/media/team/badge/uxf0gr1742983727.png |
| inter | Inter | 133681 | https://r2.thesportsdb.com/images/media/team/badge/ryhu6d1617113103.png |
| ac-milan | AC Milan | 133667 | https://r2.thesportsdb.com/images/media/team/badge/wvspur1448806617.png |
| napoli | Napoli | 133670 | https://r2.thesportsdb.com/images/media/team/badge/l8qyxv1742982541.png |
| roma | Roma | 133682 | https://r2.thesportsdb.com/images/media/team/badge/jwro2s1760820674.png |
| atalanta | Atalanta | 134782 | https://r2.thesportsdb.com/images/media/team/badge/qix5ku1780561327.png |
| fiorentina | Fiorentina | 133674 | https://r2.thesportsdb.com/images/media/team/badge/hc8nhu1656098030.png |
| lazio | Lazio | 133668 | https://r2.thesportsdb.com/images/media/team/badge/rwqyvs1448806608.png |
| bologna | Bologna | 134781 | https://r2.thesportsdb.com/images/media/team/badge/2qi1u31655592366.png |
| torino | Torino | 133687 | https://r2.thesportsdb.com/images/media/team/badge/xxprty1448806802.png |

### Italia — Serie B

| id club | Nome | TSDB idTeam | URL stemma |
|---|---|---|---|
| sampdoria | Sampdoria | 133683 | https://r2.thesportsdb.com/images/media/team/badge/pr6co21655592769.png |
| palermo | Palermo | 138166 | https://r2.thesportsdb.com/images/media/team/badge/zi1tb01579708939.png |
| bari | Bari | 133688 | https://r2.thesportsdb.com/images/media/team/badge/isfrtg1579724972.png |
| cesena | Cesena | 133669 | https://r2.thesportsdb.com/images/media/team/badge/9l00zr1677256723.png |
| modena | Modena | 133700 | https://r2.thesportsdb.com/images/media/team/badge/93n2wm1656015823.png |
| reggiana | Reggiana | 137121 | https://r2.thesportsdb.com/images/media/team/badge/dffx6o1600266770.png |
| cremonese | Cremonese | 134224 | https://r2.thesportsdb.com/images/media/team/badge/6ng2vy1579708291.png |
| catanzaro | Catanzaro | 134223 | https://r2.thesportsdb.com/images/media/team/badge/byrc5e1691995858.png |
| carrarese | Carrarese | 134666 | https://r2.thesportsdb.com/images/media/team/badge/njh6tl1651779724.png |
| frosinone | Frosinone | 133818 | https://r2.thesportsdb.com/images/media/team/badge/a7xa151603170120.png |

### Italia — Serie C

| id club | Nome | TSDB idTeam | URL stemma |
|---|---|---|---|
| padova | Padova | 135950 | https://r2.thesportsdb.com/images/media/team/badge/hklo0i1579724992.png |
| pescara | Pescara | 133685 | https://r2.thesportsdb.com/images/media/team/badge/uywyxr1426869511.png |
| virtus-entella | Virtus Entella | 134633 | https://r2.thesportsdb.com/images/media/team/badge/c7yb5u1693457662.png |
| pisa-sc | Pisa | 133859 | https://r2.thesportsdb.com/images/media/team/badge/2eso9w1579708309.png |
| gubbio | Gubbio | 133698 | https://r2.thesportsdb.com/images/media/team/badge/el7zx61680802664.png |
| pontedera | Pontedera | 134675 | https://r2.thesportsdb.com/images/media/team/badge/emkgc41651779179.png |
| novara | Novara | 133673 | https://r2.thesportsdb.com/images/media/team/badge/urbkrr1675352937.png |
| triestina | Triestina | 133821 | https://r2.thesportsdb.com/images/media/team/badge/13hyc21533752996.png |

### Inghilterra — Premier League

| id club | Nome | TSDB idTeam | URL stemma |
|---|---|---|---|
| manchester-city | Manchester City | 133613 | https://r2.thesportsdb.com/images/media/team/badge/vwpvry1467462651.png |
| liverpool | Liverpool | 133602 | https://r2.thesportsdb.com/images/media/team/badge/kfaher1737969724.png |
| arsenal | Arsenal | 133604 | https://r2.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png |
| manchester-united | Manchester United | 133612 | https://r2.thesportsdb.com/images/media/team/badge/xzqdr11517660252.png |
| chelsea | Chelsea | 133610 | https://www.thesportsdb.com/images/media/team/badge/pbf4ul1782638263.png |
| tottenham | Tottenham Hotspur | 133616 | https://r2.thesportsdb.com/images/media/team/badge/dfyfhl1604094109.png |
| newcastle | Newcastle United | 134777 | https://r2.thesportsdb.com/images/media/team/badge/lhwuiz1621593302.png |
| aston-villa | Aston Villa | 133601 | https://www.thesportsdb.com/images/media/team/badge/97mehy1784645865.png |
| brighton | Brighton & Hove Albion | 133619 | https://r2.thesportsdb.com/images/media/team/badge/ywypts1448810904.png |
| west-ham | West Ham United | 133636 | https://r2.thesportsdb.com/images/media/team/badge/yutyxs1467459956.png |
| everton | Everton | 133615 | https://r2.thesportsdb.com/images/media/team/badge/eqayrf1523184794.png |
| wolves | Wolverhampton Wanderers | 133599 | https://r2.thesportsdb.com/images/media/team/badge/u9qr031621593327.png |

### Inghilterra — Championship

| id club | Nome | TSDB idTeam | URL stemma |
|---|---|---|---|
| sunderland | Sunderland | 133603 | https://r2.thesportsdb.com/images/media/team/badge/tprtus1448813498.png |
| southampton | Southampton | 134778 | https://r2.thesportsdb.com/images/media/team/badge/ggqtd01621593274.png |
| leeds-united | Leeds United | 133635 | https://r2.thesportsdb.com/images/media/team/badge/jcgrml1756649030.png |
| norwich-city | Norwich City | 133608 | https://r2.thesportsdb.com/images/media/team/badge/pabczm1679951464.png |
| west-brom | West Bromwich Albion | 133611 | https://r2.thesportsdb.com/images/media/team/badge/rsvuxw1448813527.png |
| preston | Preston North End | 133809 | https://r2.thesportsdb.com/images/media/team/badge/wqtwvw1448811512.png |
| middlesbrough | Middlesbrough | 133628 | https://r2.thesportsdb.com/images/media/team/badge/advjg71780068902.png |
| coventry-city | Coventry City | 133625 | https://r2.thesportsdb.com/images/media/team/badge/uxyqys1424033798.png |

### Spagna — La Liga

| id club | Nome | TSDB idTeam | URL stemma |
|---|---|---|---|
| real-madrid | Real Madrid | 133738 | https://r2.thesportsdb.com/images/media/team/badge/vwvwrw1473502969.png |
| barcelona | Barcelona | 133739 | https://r2.thesportsdb.com/images/media/team/badge/wq9sir1639406443.png |
| atletico-madrid | Atlético Madrid | 133729 | https://r2.thesportsdb.com/images/media/team/badge/0ulh3q1719984315.png |
| sevilla | Sevilla | 133735 | https://r2.thesportsdb.com/images/media/team/badge/vpsqqx1473502977.png |
| real-sociedad | Real Sociedad | 133724 | https://r2.thesportsdb.com/images/media/team/badge/vptvpr1473502986.png |
| real-betis | Real Betis | 133722 | https://r2.thesportsdb.com/images/media/team/badge/2oqulv1663245386.png |
| villarreal | Villarreal | 133740 | https://r2.thesportsdb.com/images/media/team/badge/vrypqy1473503073.png |
| athletic-bilbao | Athletic Bilbao | 133727 | https://r2.thesportsdb.com/images/media/team/badge/68w7fe1639408210.png |
| valencia | Valencia | 133725 | https://r2.thesportsdb.com/images/media/team/badge/dm8l6o1655594864.png |
| girona | Girona | 134700 | https://r2.thesportsdb.com/images/media/team/badge/kfu7zu1659897499.png |

### Spagna — LaLiga 2

| id club | Nome | TSDB idTeam | URL stemma |
|---|---|---|---|
| las-palmas | Las Palmas | 134259 | https://r2.thesportsdb.com/images/media/team/badge/mmhyb11616443601.png |
| real-oviedo | Real Oviedo | 135455 | https://r2.thesportsdb.com/images/media/team/badge/yuwqus1447590681.png |
| racing-santander | Racing Santander | 133726 | https://r2.thesportsdb.com/images/media/team/badge/97kkiq1536575158.png |
| sporting-gijon | Sporting Gijón | 133723 | https://r2.thesportsdb.com/images/media/team/badge/xxrtqx1473503054.png |
| malaga | Málaga | 133736 | https://r2.thesportsdb.com/images/media/team/badge/upqyvr1473502952.png |
| eibar | Eibar | 134626 | https://r2.thesportsdb.com/images/media/team/badge/hccive1680933599.png |
| levante | Levante | 133732 | https://r2.thesportsdb.com/images/media/team/badge/xwtxsx1473503739.png |
| albacete | Albacete | 134232 | https://r2.thesportsdb.com/images/media/team/badge/17oqja1616436316.png |

> Nota: cercando "Sporting Gijon" senza accento, TheSportsDB restituiva prima "Sporting Atlético"
> (la squadra riserve/B del club) invece del club principale. Risolto cercando "Sporting de Gijón",
> che dà idTeam 133723 (prima squadra, milita in Segunda División). Verificare comunque a vista
> prima dell'uso in app.

### Brasile — Série A

| id club | Nome | TSDB idTeam | URL stemma |
|---|---|---|---|
| flamengo | Flamengo | 134287 | https://r2.thesportsdb.com/images/media/team/badge/syptwx1473538074.png |
| palmeiras | Palmeiras | 134465 | https://r2.thesportsdb.com/images/media/team/badge/vsqwqp1473538105.png |
| sao-paulo | São Paulo | 134291 | https://r2.thesportsdb.com/images/media/team/badge/sxpupx1473538135.png |
| corinthians | Corinthians | 134284 | https://r2.thesportsdb.com/images/media/team/badge/vvuvps1473538042.png |
| gremio | Grêmio | 134288 | https://r2.thesportsdb.com/images/media/team/badge/uvpwyt1473538089.png |
| internacional | Internacional | 134281 | https://r2.thesportsdb.com/images/media/team/badge/yprvxx1473538097.png |
| fluminense | Fluminense | 134296 | https://r2.thesportsdb.com/images/media/team/badge/stvvwp1473538082.png |
| atletico-mineiro | Atlético Mineiro | 134299 | https://r2.thesportsdb.com/images/media/team/badge/x5lixs1743742872.png |
| cruzeiro | Cruzeiro | 134294 | https://r2.thesportsdb.com/images/media/team/badge/upsvvu1473538059.png |
| botafogo | Botafogo | 134285 | https://r2.thesportsdb.com/images/media/team/badge/bs5mbw1733004596.png |

### Brasile — Série B

| id club | Nome | TSDB idTeam | URL stemma |
|---|---|---|---|
| remo | Remo | 137818 | https://r2.thesportsdb.com/images/media/team/badge/u36jfy1579341655.png |
| coritiba | Coritiba | 134298 | https://r2.thesportsdb.com/images/media/team/badge/ywwsyu1473538050.png |
| chapecoense | Chapecoense | 134464 | https://r2.thesportsdb.com/images/media/team/badge/wy0e1i1765900601.png |
| vila-nova | Vila Nova | 134734 | https://r2.thesportsdb.com/images/media/team/badge/nwd4ns1740851638.png |
| ponte-preta | Ponte Preta | 134290 | https://r2.thesportsdb.com/images/media/team/badge/wbss4d1644929547.png |
| nautico | Náutico | 134289 | https://r2.thesportsdb.com/images/media/team/badge/wywuwv1464886832.png |
| crb | CRB | 135680 | https://r2.thesportsdb.com/images/media/team/badge/vpypuq1472069179.png |
| avai | Avaí | 134738 | https://r2.thesportsdb.com/images/media/team/badge/bblkat1766506007.png |

**Copertura club: 84/84 trovati.** Nessun club mancante.

## 3. Competizioni — URL badge

Endpoint usati: `search_all_leagues.php?c=<paese>&s=Soccer` per scoprire gli id, poi
`lookupleague.php?id=<id>` per confermare nome/badge esatti (la lista completa per paese viene
troncata dal fetcher quando il paese ha molte leghe minori, quindi il lookup puntuale per id è
la fonte affidabile qui).

| Competizione (clubs.ts) | TSDB strLeague | TSDB idLeague | URL badge |
|---|---|---|---|
| Serie A (Italia) | Italian Serie A | 4332 | https://r2.thesportsdb.com/images/media/league/badge/67q3q21679951383.png |
| Serie B (Italia) | Italian Serie B | 4394 | https://r2.thesportsdb.com/images/media/league/badge/uf5kph1598011132.png |
| Serie C (Italia) | *(vedi nota sotto — 3 gironi)* | 5340 / 5339 / 4398 | vedi riga sotto |
| Coppa Italia | Coppa Italia | 4506 | https://r2.thesportsdb.com/images/media/league/badge/hrm1vo1692679408.png |
| Premier League (Inghilterra) | English Premier League | 4328 | https://r2.thesportsdb.com/images/media/league/badge/gasy9d1737743125.png |
| Championship (Inghilterra) | English League Championship | 4329 | https://r2.thesportsdb.com/images/media/league/badge/ty5a681688770169.png |
| FA Cup | FA Cup | 4482 | https://r2.thesportsdb.com/images/media/league/badge/vk7isd1598802862.png |
| La Liga (Spagna) | Spanish La Liga | 4335 | https://r2.thesportsdb.com/images/media/league/badge/ja4it51687628717.png |
| LaLiga 2 (Spagna) | Spanish La Liga 2 | 4400 | https://r2.thesportsdb.com/images/media/league/badge/r7u6821688425700.png |
| Copa del Rey | Copa del Rey | 4483 | https://r2.thesportsdb.com/images/media/league/badge/2ikh3a1671782958.png |
| Brasileirão Série A | Brazilian Serie A | 4351 | https://r2.thesportsdb.com/images/media/league/badge/lywv7t1766787179.png |
| Brasileirão Série B | Brazilian Serie B | 4404 | https://r2.thesportsdb.com/images/media/league/badge/iiz0gf1778446845.png |
| Copa do Brasil | Copa do Brasil | 4725 | https://r2.thesportsdb.com/images/media/league/badge/h38dax1582151151.png |
| Champions League (UEFA) | UEFA Champions League | 4480 | https://r2.thesportsdb.com/images/media/league/badge/facv1u1742998896.png |
| Copa Libertadores | Copa Libertadores | 4501 | https://r2.thesportsdb.com/images/media/league/badge/9shr931685425181.png |

**Serie C — dettaglio gironi** (TheSportsDB non ha un'unica lega "Serie C", la modella come 3
gironi separati, coerente col fatto che è davvero organizzata così nella realtà):

| Girone | idLeague | URL badge |
|---|---|---|
| Italian Serie C Girone A | 5340 | https://r2.thesportsdb.com/images/media/league/badge/bj89ar1753593637.png |
| Italian Serie C Girone B | 5339 | https://r2.thesportsdb.com/images/media/league/badge/eerhwz1753593645.png |
| Italian Serie C Girone C | 4398 | https://r2.thesportsdb.com/images/media/league/badge/m450je1753593640.png |

**Copertura competizioni: 14/14 trovate come lega/coppa nominata**, più il caso particolare
Serie C risolto con 3 badge di girone invece di un badge unico (vedi sezione 4).

## 4. Cosa manca / da verificare manualmente

- **Nessun club dei 84 è mancante.**
- **Serie C non ha un badge unico su TheSportsDB**: se l'app ha bisogno di UN SOLO logo per
  "Serie C" generico, va scelto arbitrariamente uno dei 3 gironi (o disegnato un badge proprio),
  perché la fonte non offre un badge "Lega Pro" complessivo — solo i 3 gironi.
- **Sporting Gijón**: la ricerca semplice per nome ambigua (vedi nota nella tabella LaLiga 2) —
  usato l'idTeam 133723 dopo verifica esplicita, ma vale la pena un controllo visivo del badge
  prima di integrarlo in app, dato il rischio di confusione con la squadra B.
- **Nomi non ufficiali/abbreviati restituiti da TheSportsDB**: alcuni strTeam sono abbreviati
  rispetto al nome ufficiale (es. "Roma" invece di "AS Roma", "Inter Milan" invece di "Inter",
  "Racing de Santander" invece di "Racing Santander") — normale per l'API, non è un problema per
  l'hotlink ma i nomi vanno mappati/ignorati e si deve usare l'id club interno di clubs.ts come
  chiave primaria (cosa che questo documento già fa).
- **Volatilità dei roster di lega su TheSportsDB**: le query `search_all_teams.php?l=<lega>`
  usate in fase esplorativa mostravano roster della stagione corrente (es. Frosinone elencato
  ancora in Serie A, squadre già retrocesse/promosse) — non è stato un problema per il deliverable
  finale perché ogni club è stato verificato singolarmente via `searchteams.php?t=<nome>`
  (endpoint che restituisce il record squadra indipendentemente dalla lega corrente), ma se in
  futuro si userà `search_all_teams.php` per lega, ricordare che l'elenco riflette la stagione in
  corso su TheSportsDB, non necessariamente le leghe/tier assegnati in `clubs.ts`.
- **Host misto `r2.thesportsdb.com` / `www.thesportsdb.com`**: alcuni badge più recenti sono
  serviti da `www.thesportsdb.com/images/...` invece del CDN `r2.thesportsdb.com/images/...`
  (es. Chelsea, Aston Villa). Entrambi risultano host ufficiali del sito, quindi utilizzabili in
  hotlink; se si vuole uniformità si può normalizzare via redirect o accettare l'host così com'è.
