'use client';

import { useState, useCallback } from 'react';

interface UseMutationOptions<T, V> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export function useMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options?: UseMutationOptions<T, V>
) {
  const [state, setState] = useState({
    data: null as T | null,
    loading: false,
    error: null as string | null,
  });

  const mutate = useCallback(
    async (variables: V) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const data = await mutationFn(variables);
        setState({ data, loading: false, error: null });
        options?.onSuccess?.(data);
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        options?.onError?.(errorMessage);
        throw error;
      }
    },
    [mutationFn, options]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, mutate, reset };
}
