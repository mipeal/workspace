import { useQuery } from '@tanstack/react-query';
import { getCtfName } from '@/lib/api';
import { useConfig } from '@/contexts/config-context';

export function useCtfName() {
  const { config } = useConfig();

  return useQuery({
    queryKey: ['ctf-name', config.apiUrl, config.apiToken],
    queryFn: () => getCtfName(config),
    enabled: Boolean(config.apiUrl && config.apiToken),
    staleTime: 5 * 60 * 1000, // 5 minutes - CTF name doesn't change often
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
