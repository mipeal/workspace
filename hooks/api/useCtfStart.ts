import { useQuery } from '@tanstack/react-query';
import { getCtfStart } from '@/lib/api';
import { useConfig } from '@/contexts/config-context';

export function useCtfStart() {
  const { config } = useConfig();

  return useQuery({
    queryKey: ['ctf-start', config.apiUrl, config.apiToken],
    queryFn: () => getCtfStart(config),
    enabled: Boolean(config.apiUrl && config.apiToken),
    staleTime: 5 * 60 * 1000, // 5 minutes - start time doesn't change often
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
