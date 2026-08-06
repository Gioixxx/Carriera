const STORAGE_KEY = "carriera:audio-settings";

export interface AudioSettings {
  volume: number;
  muted: boolean;
}

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = { volume: 0.5, muted: false };

export function loadAudioSettings(): AudioSettings {
  if (typeof window === "undefined") return DEFAULT_AUDIO_SETTINGS;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_AUDIO_SETTINGS;

  try {
    const parsed = JSON.parse(raw) as Partial<AudioSettings>;
    const volume = typeof parsed.volume === "number" ? clampVolume(parsed.volume) : DEFAULT_AUDIO_SETTINGS.volume;
    const muted = typeof parsed.muted === "boolean" ? parsed.muted : DEFAULT_AUDIO_SETTINGS.muted;
    return { volume, muted };
  } catch {
    return DEFAULT_AUDIO_SETTINGS;
  }
}

export function saveAudioSettings(settings: AudioSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function clampVolume(volume: number): number {
  return Math.min(1, Math.max(0, volume));
}
