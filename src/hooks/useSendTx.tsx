import { useState } from 'react';
import { toast } from 'sonner';

interface UseSendTxProps {
  action: () => Promise<string>;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useSendTx = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendTx = async ({ action, onSuccess, onError }: UseSendTxProps) => {
    try {
      setIsLoading(true);
      await action();
      onSuccess?.();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        toast.error('User rejected the transaction');
      } else if (
        error.message.includes(
          'User does not have an Associated Token Account for'
        )
      ) {
        toast.error('User does not have insufficient balance.');
      } else {
        console.log(error);
        toast.error(
          error instanceof Error ? error.message.slice(0, 200) : 'Unknown error'
        );
      }
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { sendTx, isLoading };
};
