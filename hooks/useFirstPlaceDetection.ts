import { useState, useEffect, useCallback } from 'react';
import { ScoreboardEntry } from '@/types/ctfd';

interface FirstPlaceChangeData {
  previousLeader: {
    id: number;
    name: string;
    score: number;
  } | null;
  newLeader: {
    id: number;
    name: string;
    score: number;
  };
}

/**
 * Custom hook to detect when the 1st place position changes
 */
export function useFirstPlaceDetection() {
  const [previousLeader, setPreviousLeader] = useState<{id: number; name: string; score: number} | null>(null);
  const [firstPlaceChangeData, setFirstPlaceChangeData] = useState<FirstPlaceChangeData | null>(null);
  const [showLiquidAnimation, setShowLiquidAnimation] = useState(false);

  const checkLeaderboardChange = useCallback((scoreboardData: Record<string, ScoreboardEntry> | undefined) => {
    if (!scoreboardData) return;

    // Get the current leader (position 1)
    const currentLeaderEntry = scoreboardData['1'];
    if (!currentLeaderEntry) return;

    const currentLeader = {
      id: currentLeaderEntry.id,
      name: currentLeaderEntry.name,
      score: currentLeaderEntry.score
    };

    // Check if this is the first time we're getting leaderboard data
    if (previousLeader === null) {
      setPreviousLeader(currentLeader);
      return;
    }

    // Check if the leader has changed (different user ID in 1st place)
    if (previousLeader.id !== currentLeader.id) {
      // We have a new leader!
      setFirstPlaceChangeData({
        previousLeader,
        newLeader: currentLeader
      });
      setShowLiquidAnimation(true);
      setPreviousLeader(currentLeader);
    } else if (previousLeader.score !== currentLeader.score) {
      // Same leader, but score changed - update the previous leader data
      setPreviousLeader(currentLeader);
    }
  }, [previousLeader]);

  const hideLiquidAnimation = useCallback(() => {
    setShowLiquidAnimation(false);
  }, []);

  const resetLeaderTracking = useCallback(() => {
    setPreviousLeader(null);
    setFirstPlaceChangeData(null);
    setShowLiquidAnimation(false);
  }, []);

  return {
    firstPlaceChangeData,
    showLiquidAnimation,
    checkLeaderboardChange,
    hideLiquidAnimation,
    resetLeaderTracking,
  };
}
