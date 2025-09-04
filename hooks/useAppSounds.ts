import { AppSounds } from '@/types/sounds';
import { useEffect, useState } from 'react';

const SUCCESS_SOUND = '/sounds/success.mp3';
const ERROR_SOUND = '/sounds/error.mp3';
const FIRST_BLOOD_SOUND = '/sounds/firstblood.mp3';

export function useAppSounds(): AppSounds {
  const [isClient, setIsClient] = useState(false);
  const [sounds, setSounds] = useState<AppSounds>({
    playSuccess: () => {},
    playError: () => {},
    playFirstBlood: () => {},
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Dynamically import use-sound only on the client
    const loadSounds = async () => {
      const { default: useSound } = await import('use-sound');
      
      const [playSuccess] = useSound(SUCCESS_SOUND);
      const [playError] = useSound(ERROR_SOUND);
      const [playFirstBlood] = useSound(FIRST_BLOOD_SOUND, { volume: 0.8 });

      setSounds({ playSuccess, playError, playFirstBlood });
    };

    loadSounds();
  }, [isClient]);

  return sounds;
}