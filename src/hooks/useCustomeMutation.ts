// hooks/useCustomMutation.ts
import { useToastStore } from '@/lib/store/toast-store';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

type MutationFn<TVariables, TData> = (body: TVariables) => Promise<TData>;

interface UseCustomMutationOptions<TData> {
  onSuccessCallback?: (data: TData) => void;
  onErrorCallback?: (error: string) => void;
}

// 🧠 Generic safe extractor
const extractMessage = (obj: unknown): string => {
  if (typeof obj === 'object' && obj !== null) {
    const response = obj as {
      data?: { message?: string };
      message?: string;
    };

    return response.data?.message ?? response.message ?? 'Success';
  }
  return 'Success';
};

export const useCustomMutation = <TVariables, TData>(
  mutationFn: MutationFn<TVariables, TData>,
  options?: UseCustomMutationOptions<TData>
): UseMutationResult<TData, unknown, TVariables> & {
  trigger: (body: TVariables) => void;
} => {
  const mutation = useMutation<TData, unknown, TVariables>({
    mutationFn,
    onSuccess: data => {
      const message = extractMessage(data);
      useToastStore.getState().triggerToast(message, 'success', 'top-right');

      options?.onSuccessCallback?.(data);
    },
    onError: error => {
      const message = extractMessage(error);
      console.error('Mutation error:', error);
      options?.onErrorCallback?.(message as string);
    },
  });

  const trigger = (body: TVariables) => {
    mutation.mutate(body);
  };

  return {
    ...mutation,
    trigger,
  };
};
