'use client';

import { useQuery } from '@tanstack/react-query';
import { useConfig } from '@/contexts/config-context';
import { getChallengeSolves } from '@/lib/api';
import type { ChallengeSolvesResponse } from '@/types/ctfd';

/**
 * Hook to fetch solves for a specific challenge
 * @param challengeId The ID of the challenge to get solves for
 * @returns Query result with the challenge solves data
 */
export function useChallengeSolves(challengeId?: number) {
  const { config, isConfigured } = useConfig();

  return useQuery<ChallengeSolvesResponse>({
    queryKey: ['challenge-solves', challengeId, config.apiUrl, config.apiToken],
    queryFn: () => getChallengeSolves(config, challengeId as number),
    enabled: isConfigured && challengeId !== undefined,
    refetchInterval: config.refetchInterval,
    staleTime: Math.max(config.refetchInterval / 2, 5000),
  });
}
