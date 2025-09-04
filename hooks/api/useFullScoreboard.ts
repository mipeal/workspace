// /src/hooks/api/useFullScoreboard.ts
import { useQuery } from '@tanstack/react-query';
import { getFullScoreboard } from '@/lib/api';
import { useConfig } from '@/contexts/config-context';
import type { ScoreboardEntry } from '@/types/ctfd';

export function useFullScoreboard() {
  const { config, isConfigured } = useConfig();
  
  return useQuery<ScoreboardEntry[]>({
    queryKey: ['fullScoreboard', config.apiUrl, config.apiToken],
    queryFn: () => getFullScoreboard(config),
    refetchInterval: config.refetchInterval, // Use configurable refetch interval
    enabled: isConfigured, // Only run query when config is available
  });
}
