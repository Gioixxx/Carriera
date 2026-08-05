"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ClubCrestProps {
  crestUrl: string;
  clubName: string;
  size?: number;
  className?: string;
}

/** Stemma club in hotlink (mai scaricato) — si nasconde da solo se l'host esterno non risponde. */
export function ClubCrest({ crestUrl, clubName, size = 20, className }: ClubCrestProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- hotlink esterno (TheSportsDB), non un asset locale: next/image richiederebbe unoptimized/remotePatterns senza benefici sotto export statico.
    <img
      src={crestUrl}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("shrink-0 object-contain", className)}
      title={clubName}
    />
  );
}
