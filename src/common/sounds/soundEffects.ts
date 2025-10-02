// Windows XP Sound Effects Utility

export type SoundEffect =
  | "startup"
  | "logon"
  | "logoff"
  | "shutdown"
  | "start"
  | "balloon"
  | "criticalStop";

const soundPaths: Record<SoundEffect, string> = {
  startup: "/sounds/Windows XP Startup.mp3",
  logon: "/sounds/Windows XP Logon Sound.mp3",
  logoff: "/sounds/Windows XP Logoff Sound.mp3",
  shutdown: "/sounds/Windows XP Shutdown.mp3",
  start: "/sounds/Windows XP Start.mp3",
  balloon: "/sounds/Windows XP Balloon.mp3",
  criticalStop: "/sounds/Windows XP Critical Stop.mp3",
};

let currentAudio: HTMLAudioElement | null = null;

export function playSound(sound: SoundEffect, volume: number = 0.5): void {
  try {
    // Stop any currently playing sound
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(soundPaths[sound]);
    audio.volume = Math.max(0, Math.min(1, volume));
    currentAudio = audio;

    audio.play().catch((error) => {
      console.warn(`Failed to play sound ${sound}:`, error);
    });

    // Clear reference when sound finishes
    audio.addEventListener("ended", () => {
      if (currentAudio === audio) {
        currentAudio = null;
      }
    });
  } catch (error) {
    console.warn(`Error playing sound ${sound}:`, error);
  }
}

export function stopSound(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}
