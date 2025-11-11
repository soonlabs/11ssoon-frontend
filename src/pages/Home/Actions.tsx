import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

import ENDPOINTS from '@/api';
import { DownButton, UpButton } from '@/components/ActionButton';
import { useSendTx } from '@/hooks/useSendTx';
import { useX402FetchWithPay } from '@/hooks/useX402FetchWithPay';
import { cn } from '@/lib/utils';
import useBettingStatusStore from '@/store/useBettingStatusStore';
import useButtonHoverStatusStore from '@/store/useButtonHoverStatusStore';
import useRoundStore from '@/store/useRoundStore';

const Actions = () => {
  const isCurrentRoundEnded = useRoundStore(state => state.isCurrentRoundEnded);
  const updateRoundState = useRoundStore(state => state.updateState);
  // Detect whether the device is touch-capable
  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);
  const { isConnected: isSolanaConnected } = useAppKitAccount({
    namespace: 'solana',
  });
  const { open } = useAppKit();

  const { sendTx, isLoading } = useSendTx();
  const fetchWithPay = useX402FetchWithPay();

  const [direction, setDirection] = useState<'up' | 'down'>();
  // Use selector to avoid re-rendering caused by countdown changes
  const updateState = useBettingStatusStore(state => state.updateState);
  const totalCountdown = useBettingStatusStore(state => state.totalCountdown);
  const isBetting = useBettingStatusStore(state => state.isBetting);
  const bettingDirection = useBettingStatusStore(
    state => state.bettingDirection
  );

  const { setIsHoveringUpButton, setIsHoveringDownButton } =
    useButtonHoverStatusStore();

  const handleBet = async (direction: 'up' | 'down') => {
    if (isLoading || isBetting) return;

    if (!isSolanaConnected) {
      open({
        view: 'Connect',
        namespace: 'solana',
      });
      return;
    }

    sendTx({
      action: async () => {
        setDirection(direction);
        const res = await fetchWithPay(ENDPOINTS.betSolana, {
          method: 'POST',
          body: JSON.stringify({
            direction,
          }),
        }).then(res => res.json());

        if (res.error) {
          if (res.error.includes('please wait for next round to open')) {
            updateRoundState({
              isCurrentRoundEnded: true,
            });
          }
          throw new Error(res.error);
        }

        updateState({
          bettingPrice: res.data.betPrice,
          isBetting: true,
          countdown: totalCountdown,
          bettingDirection: res.data.direction as 'up' | 'down',
          bettingOrderId: res.data.orderId,
        });

        return 'success';
      },
      onSuccess: () => {
        toast.success('Successful');
        setDirection(undefined);
      },
      onError: () => {
        setDirection(undefined);
      },
    });
  };

  const handleUpMouseEnter = () => {
    if (!isTouchDevice.current && !isBetting) {
      setIsHoveringUpButton(true);
    }
  };

  const handleUpMouseLeave = () => {
    if (!isTouchDevice.current) {
      setIsHoveringUpButton(false);
    }
  };

  const handleDownMouseEnter = () => {
    if (!isTouchDevice.current && !isBetting) {
      setIsHoveringDownButton(true);
    }
  };

  const handleDownMouseLeave = () => {
    if (!isTouchDevice.current) {
      setIsHoveringDownButton(false);
    }
  };

  return (
    <div className="flex gap-2.5">
      <UpButton
        className={cn(isBetting && bettingDirection === 'up' && 'active')}
        disabled={
          isCurrentRoundEnded ||
          direction === 'down' ||
          bettingDirection === 'down'
        }
        isLoading={direction === 'up' ? isLoading : false}
        onClick={() => handleBet('up')}
        onMouseEnter={handleUpMouseEnter}
        onMouseLeave={handleUpMouseLeave}
      />
      <DownButton
        className={cn(isBetting && bettingDirection === 'down' && 'active')}
        disabled={
          isCurrentRoundEnded || direction === 'up' || bettingDirection === 'up'
        }
        isLoading={direction === 'down' ? isLoading : false}
        onClick={() => handleBet('down')}
        onMouseEnter={handleDownMouseEnter}
        onMouseLeave={handleDownMouseLeave}
      />
    </div>
  );
};

export default Actions;
