// /src/hooks/api/useChallengeById.ts
import { useQuery } from '@tanstack/react-query';
import { getChallengeById } from '@/lib/api';
import { useConfig } from '@/contexts/config-context';

export function useChallengeById(id: number) {
  const { config, isConfigured } = useConfig();
  
  return useQuery({
    queryKey: ['challenge', id, config.apiUrl, config.apiToken], // The query key includes the ID to ensure uniqueness
    queryFn: () => getChallengeById(id, config),
    enabled: !!id && isConfigured, // The query will not run until an ID is provided and config is available
  });
}