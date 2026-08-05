"use client";

import { useState } from "react";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";

// Icona trofeo stilizzata generica (Twemoji, CC BY 4.0) — non una foto del trofeo reale: i premi
// individuali del gioco (Pallone d'Oro incluso) hanno meccaniche/soglie nostre, non quelle vere
// su licenza, quindi si evita un'immagine che suggerisca un'associazione con l'ente reale.
// Vedi .claude/research/team-crests.md sezione 6 per la valutazione completa.
const TWEMOJI_TROPHY_URL =
  "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/1f3c6.svg";

interface AwardBadgeProps {
  size?: number;
  className?: string;
}

export function AwardBadge({ size = 20, className }: AwardBadgeProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <Award
        size={size * 0.7}
        aria-hidden="true"
        className={cn("shrink-0 text-(--color-ovr-gold)", className)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- hotlink esterno (Twemoji via CDN), non un asset locale: next/image richiederebbe unoptimized/remotePatterns senza benefici sotto export statico.
    <img
      src={TWEMOJI_TROPHY_URL}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
