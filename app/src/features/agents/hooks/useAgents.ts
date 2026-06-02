import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api/client';

// Typed against the generated contract — breaks at compile time if the API changes.
export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: () => api.GET('/agents'),
  });
}
