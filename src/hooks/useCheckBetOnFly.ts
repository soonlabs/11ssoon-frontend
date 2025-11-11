import { useAppKitAccount } from '@reown/appkit/react';
import { useEffect, useState } from 'react';

import ENDPOINTS from '@/api';
import useBettingStatusStore from '@/store/useBettingStatusStore';
import { getAssociatedTokenAddress } from '@/utils/solana';
import config from '@/config';

export const useCheckBetOnFly = () => {
  const { address: solanaAddress } = useAppKitAccount({ namespace: 'solana' });
  const isSolanaConnected = !!solanaAddress;
  // Use selector to avoid re-renders caused by countdown changes
  const updateState = useBettingStatusStore(state => state.updateState);
  const totalCountdown = useBettingStatusStore(state => state.totalCountdown);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isSolanaConnected) {
      setIsLoading(true);
      fetch(ENDPOINTS.betOnFly, {
        method: 'POST',
        body: JSON.stringify({
          address:
            config.SVM_NETWORK === 'solana-devnet'
              ? solanaAddress
              : getAssociatedTokenAddress(
                  solanaAddress!,
                  config.SOLANA_USDC_ADDRESS
                ),
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.code === 0) {
            const order = data.data;
            // {
            //   betPrice: "101786.73"
            //   betTime: '2025-11-07T04:41:32Z',
            //   direction: 'down',
            //   orderId: '802',
            // }

            // Compute remaining countdown (precision to 1 decimal, rounded up)
            const betTime = new Date(order.betTime).getTime();
            const currentTime = Date.now();
            const elapsedSeconds = (currentTime - betTime) / 1000;
            // Round up to one decimal place
            const elapsedSecondsRounded = Math.ceil(elapsedSeconds * 10) / 10;
            // Ensure remainingCountdown is also precise to one decimal to avoid floating-point precision issues
            const remainingCountdown = Math.max(
              0,
              Math.round((totalCountdown - elapsedSecondsRounded) * 10) / 10
            );

            updateState({
              isBetting: true,
              countdown: remainingCountdown,
              bettingPrice: order.betPrice,
              bettingDirection: order.direction as 'up' | 'down',
              bettingOrderId: order.orderId,
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [isSolanaConnected, solanaAddress, updateState, totalCountdown]);

  return { isLoading };
};
