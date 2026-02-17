import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import { AxiosError } from 'axios';

type QueryFunction<TResponse> = (signal?: AbortSignal) => Promise<TResponse>;

export const useCustomeQuery = <TResponse>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TResponse>,
  options?: Omit<UseQueryOptions<TResponse, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<TResponse, AxiosError>({
    queryKey,
    queryFn: ({ signal }) => queryFn(signal),

    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,

    ...options,
  });
};
