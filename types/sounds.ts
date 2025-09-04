
export interface SoundPlayFunction {
  (): void;
}

export interface AppSounds {
  playSuccess: SoundPlayFunction;
  playError: SoundPlayFunction;
  playFirstBlood: SoundPlayFunction;
}