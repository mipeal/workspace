import { useQuery } from '@tanstack/react-query';
import { getCtfEnd } from '@/lib/api';
import { useConfig } from '@/contexts/config-context';

export function useCtfEnd() {
  const { config } = useConfig();

  return useQuery({
    queryKey: ['ctf-end', config.apiUrl, config.apiToken],
    queryFn: () => getCtfEnd(config),
    enabled: Boolean(config.apiUrl && config.apiToken),
    staleTime: 5 * 60 * 1000, // 5 minutes - end time doesn't change often
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
