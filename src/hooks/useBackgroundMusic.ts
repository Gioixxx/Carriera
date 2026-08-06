"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { clampVolume, DEFAULT_AUDIO_SETTINGS, loadAudioSettings, saveAudioSettings } from "@/lib/audio-settings";

export interface UseBackgroundMusic {
  audioRef: RefObject<HTMLAudioElement | null>;
  volume: number;
  muted: boolean;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
}

/**
 * Musica di sottofondo in loop. L'avvio della riproduzione è demandato al primo gesto
 * dell'utente (pointerdown/keydown ovunque nella pagina): i browser bloccano `play()` con audio
 * prima di un'interazione, e il menu principale è il primo schermo mostrato.
 */
export function useBackgroundMusic(): UseBackgroundMusic {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolumeState] = useState(DEFAULT_AUDIO_SETTINGS.volume);
  const [muted, setMutedState] = useState(DEFAULT_AUDIO_SETTINGS.muted);

  useEffect(() => {
    const settings = loadAudioSettings();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage non esiste in SSR
    setVolumeState(settings.volume);
    setMutedState(settings.muted);
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    const tryPlay = () => {
      audioRef.current?.play().catch(() => {
        // Best-effort: se il browser rifiuta ancora, resta silenzioso finché non arriva un
        // gesto valido successivo.
      });
    };
    window.addEventListener("pointerdown", tryPlay);
    window.addEventListener("keydown", tryPlay);
    return () => {
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("keydown", tryPlay);
    };
  }, []);

  const setVolume = useCallback(
    (next: number) => {
      const clamped = clampVolume(next);
      setVolumeState(clamped);
      saveAudioSettings({ volume: clamped, muted });
    },
    [muted],
  );

  const setMuted = useCallback(
    (next: boolean) => {
      setMutedState(next);
      saveAudioSettings({ volume, muted: next });
    },
    [volume],
  );

  return { audioRef, volume, muted, setVolume, setMuted };
}
