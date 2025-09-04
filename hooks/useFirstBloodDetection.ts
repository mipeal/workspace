import { useState, useCallback, useEffect } from 'react';
import { useConfig } from '@/contexts/config-context';
import { getChallengeSolves } from '@/lib/api';
import { Challenge, ChallengeSolve } from '@/types/ctfd';

/**
 * Custom hook to manage first blood detections and animation
 */
export function useFirstBloodDetection() {
  const [firstBloodData, setFirstBloodData] = useState<{
    solve: ChallengeSolve;
    challengeName: string;
  } | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [processedChallengeIds, setProcessedChallengeIds] = useState<Set<number>>(new Set());
  const { config, isConfigured } = useConfig();

  // Check if a challenge has just been solved for the first time
  const checkChallenge = useCallback(async (challenge: Challenge) => {
    // Only check challenges that have just been solved (solves = 1) and haven't been processed yet
    if (!isConfigured || 
        challenge.solves !== 1 || 
        processedChallengeIds.has(challenge.id)) {
      return;
    }

    try {
      // Mark this challenge as processed to prevent duplicate checks
      setProcessedChallengeIds(prev => new Set([...prev, challenge.id]));
      
      // Get all solves for this challenge
      const response = await getChallengeSolves(config, challenge.id);
      
      // The API returns solves ordered by solve time, so the first one is the first blood
      if (response.data && response.data.length > 0) {
        // We have the first blood solve
        const firstBloodSolve = response.data[0];
        setFirstBloodData({
          solve: firstBloodSolve,
          challengeName: challenge.name,
        });
        setShowAnimation(true);
      }
    } catch (error) {
      // Silently handle error - first blood detection is not critical
    }
  }, [isConfigured, config, processedChallengeIds]);

  // Check a list of challenges for potential first bloods
  const checkChallenges = useCallback((challenges: Challenge[]) => {
    if (!challenges || !Array.isArray(challenges)) return;
    
    // Filter for challenges that have exactly 1 solve (just been solved for the first time)
    const newlySolvedChallenges = challenges.filter(
      challenge => challenge.solves === 1 && !processedChallengeIds.has(challenge.id)
    );
    
    // Check each newly solved challenge for first blood
    newlySolvedChallenges.forEach(challenge => {
      checkChallenge(challenge);
    });
  }, [checkChallenge, processedChallengeIds]);

  // Reset animation state
  const hideAnimation = useCallback(() => {
    setShowAnimation(false);
  }, []);

  return {
    firstBloodData,
    showAnimation,
    checkChallenges,
    hideAnimation,
  };
}
