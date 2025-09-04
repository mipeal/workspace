'use client';

import { useState, useEffect } from 'react';
import { useCtfStart } from '@/hooks/api/useCtfStart';
import { useCtfEnd } from '@/hooks/api/useCtfEnd';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Square } from 'lucide-react';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeRemaining(targetTimestamp: number): TimeRemaining {
  const now = Date.now();
  const target = targetTimestamp * 1000; // Convert from seconds to milliseconds
  const total = target - now;
  
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, total };
}

function formatTimeComponent(value: number): string {
  return value.toString().padStart(2, '0');
}

export function CtfCountdown() {
  const { data: startTime, isLoading: startLoading } = useCtfStart();
  const { data: endTime, isLoading: endLoading } = useCtfEnd();
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({ 
    days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 
  });
  const [ctfStatus, setCtfStatus] = useState<'upcoming' | 'active' | 'ended' | 'unknown'>('unknown');

  useEffect(() => {
    if (!startTime || !endTime) return;

    const updateCountdown = () => {
      const now = Date.now() / 1000; // Convert to seconds
      
      if (now < startTime) {
        setCtfStatus('upcoming');
        setTimeRemaining(calculateTimeRemaining(startTime));
      } else if (now >= startTime && now < endTime) {
        setCtfStatus('active');
        setTimeRemaining(calculateTimeRemaining(endTime));
      } else {
        setCtfStatus('ended');
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
      }
    };

    // Update immediately
    updateCountdown();
    
    // Update every second
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  if (startLoading || endLoading) {
    return (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (!startTime || !endTime) {
    return null;
  }

  const getStatusBadge = () => {
    switch (ctfStatus) {
      case 'upcoming':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
            <Play className="h-3 w-3 mr-1" />
            Starts in
          </Badge>
        );
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
            Ends in
          </Badge>
        );
      case 'ended':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
            <Square className="h-3 w-3 mr-1" />
            Ended
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatTimeDisplay = () => {
    if (ctfStatus === 'ended') {
      return 'Competition has ended';
    }
    
    if (timeRemaining.total <= 0) {
      return ctfStatus === 'upcoming' ? 'Starting now...' : 'Ending now...';
    }

    const parts = [];
    if (timeRemaining.days > 0) parts.push(`${timeRemaining.days}d`);
    if (timeRemaining.hours > 0 || timeRemaining.days > 0) parts.push(`${formatTimeComponent(timeRemaining.hours)}h`);
    if (timeRemaining.minutes > 0 || timeRemaining.hours > 0 || timeRemaining.days > 0) parts.push(`${formatTimeComponent(timeRemaining.minutes)}m`);
    parts.push(`${formatTimeComponent(timeRemaining.seconds)}s`);

    return parts.join(' ');
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      {getStatusBadge()}
      <div className="flex items-center gap-1 font-mono">
        <Clock className="h-4 w-4" />
        {formatTimeDisplay()}
      </div>
    </div>
  );
}
