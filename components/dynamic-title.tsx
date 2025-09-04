'use client';

import { useEffect } from 'react';
import { useCtfName } from '@/hooks/api/useCtfName';
import { useCtfStart } from '@/hooks/api/useCtfStart';
import { useCtfEnd } from '@/hooks/api/useCtfEnd';

export function DynamicTitle() {
  const { data: ctfName, isLoading: nameLoading } = useCtfName();
  const { data: startTime, isLoading: startLoading } = useCtfStart();
  const { data: endTime, isLoading: endLoading } = useCtfEnd();

  useEffect(() => {
    if (nameLoading || startLoading || endLoading) return;

    let title = ctfName || 'CTFd Scoreboard';
    
    // Add status indicator to title if we have timing information
    if (startTime && endTime) {
      const now = Date.now() / 1000;
      
      if (now < startTime) {
        title = `[Upcoming] ${title}`;
      } else if (now >= startTime && now < endTime) {
        title = `[Live] ${title}`;
      } else {
        title = `[Ended] ${title}`;
      }
    }
    
    document.title = title;
  }, [ctfName, startTime, endTime, nameLoading, startLoading, endLoading]);

  return null; // This component only manages the title
}
