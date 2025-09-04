// /src/hooks/api/useChallenges.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getChallenges } from '@/lib/api';
import { useConfig } from '@/contexts/config-context';

export function useChallenges() {
  const { config, isConfigured } = useConfig();

  return useQuery({
    queryKey: ['challenges'],
    queryFn: () => getChallenges({ apiUrl: config.apiUrl, apiToken: config.apiToken }),
    enabled: isConfigured,
    refetchInterval: config.refetchInterval, // Use configurable refetch interval
    staleTime: Math.max(config.refetchInterval / 2, 5000), // Dynamic stale time based on refetch interval
  });
}
