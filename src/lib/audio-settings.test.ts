import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_AUDIO_SETTINGS, clampVolume, loadAudioSettings, saveAudioSettings } from "./audio-settings";

describe("audio-settings", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("restituisce i default quando non c'è nulla salvato", () => {
    expect(loadAudioSettings()).toEqual(DEFAULT_AUDIO_SETTINGS);
  });

  it("salva e ricarica volume e mute", () => {
    saveAudioSettings({ volume: 0.2, muted: true });
    expect(loadAudioSettings()).toEqual({ volume: 0.2, muted: true });
  });

  it("ignora un salvataggio corrotto e ripiega sui default", () => {
    window.localStorage.setItem("carriera:audio-settings", "{not json");
    expect(loadAudioSettings()).toEqual(DEFAULT_AUDIO_SETTINGS);
  });

  it("clampVolume tiene il valore tra 0 e 1", () => {
    expect(clampVolume(-0.5)).toBe(0);
    expect(clampVolume(1.5)).toBe(1);
    expect(clampVolume(0.42)).toBe(0.42);
  });

  it("clampa un volume salvato fuori range", () => {
    saveAudioSettings({ volume: 3, muted: false });
    expect(loadAudioSettings().volume).toBe(1);
  });
});
