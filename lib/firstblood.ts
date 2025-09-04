import { getChallengeSolves } from '@/lib/api';
import type { Challenge, ChallengeSolve } from '@/types/ctfd';

interface ApiConfig {
  apiUrl: string;
  apiToken: string;
}

/**
 * Checks if a challenge has been solved and returns the first blood (first solve)
 * @param challenge The challenge to check for first blood
 * @param config API configuration
 * @returns Promise with the first blood solve or null if not found
 */
export async function getFirstBloodSubmission(challenge: Challenge, config: ApiConfig): Promise<ChallengeSolve | null> {
  // Only check challenges that have at least one solve
  if (challenge.solves < 1) {
    return null;
  }
  
  try {
    // Get all solves for this challenge
    const response = await getChallengeSolves(config, challenge.id);
    
    // The API returns solves ordered by solve time, so the first one is the first blood
    if (response.data && response.data.length > 0) {
      // Return the first blood (first solve)
      return response.data[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error getting first blood solve:', error);
    return null;
  }
}
