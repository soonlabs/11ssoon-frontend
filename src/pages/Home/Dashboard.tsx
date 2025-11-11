import { useEffect, useMemo, useRef, useState } from 'react';
import Marquee from 'react-fast-marquee';

import SolanaIcon from '@/assets/solana-icon.svg';
import WinIcon from '@/assets/win.gif';
import LoseIcon from '@/assets/lose.gif';
import Smile1Icon from '@/assets/smile1.gif';
import Smile2Icon from '@/assets/smile2.gif';
import Smile3Icon from '@/assets/smile3.gif';
import Scared1Icon from '@/assets/scare1.gif';
import Scared2Icon from '@/assets/scare2.gif';
import Scared3Icon from '@/assets/scare3.gif';
import useBettingStatusStore from '@/store/useBettingStatusStore';
import useCurrentPrice from '@/hooks/useCurrentPrice';
import { cn } from '@/lib/utils';
import { useBetList } from '@/hooks/useBetList';
import { useCheckBetOnFly } from '@/hooks/useCheckBetOnFly';
import UpIcon from '@/assets/up.svg?react';
import DownIcon from '@/assets/down.svg?react';
import useButtonHoverStatusStore from '@/store/useButtonHoverStatusStore';
import PriceUpIcon from '@/assets/price-up.svg?react';
import PriceDownIcon from '@/assets/price-down.svg?react';
import useRoundStore from '@/store/useRoundStore';
import config from '@/config';

function Dashboard() {
  const isCurrentRoundEnded = useRoundStore(state => state.isCurrentRoundEnded);
  const { isLoading: isCheckingBetOnFly } = useCheckBetOnFly();
  const { price: currentPrice } = useCurrentPrice();
  const {
    isBetting,
    isSettling,
    countdown,
    totalCountdown,
    bettingPrice,
    closingPrice,
    bettingDirection,
    bettingOrderId,
    bettingResult,
    updateState,
    reset,
  } = useBettingStatusStore();
  const { data, refetch } = useBetList();
  const betList = data?.betList;
  const { isHoveringUpButton, isHoveringDownButton } =
    useButtonHoverStatusStore();
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (!isBetting || currentPrice === undefined || bettingPrice === null) {
      setDirection(null);
      return;
    }
    if (currentPrice > parseFloat(bettingPrice)) {
      setDirection('up');
    } else {
      setDirection('down');
    }
  }, [currentPrice, bettingPrice, isBetting]);

  // Use refs to store start time and initial countdown to avoid re-creation
  const startTimeRef = useRef<number | null>(null);
  const startCountdownRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isBetting) {
      // Reset refs
      startTimeRef.current = null;
      startCountdownRef.current = null;
      return;
    }

    // On first countdown start, record start time and initial value
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
      startCountdownRef.current = countdown;
    }

    const timer = setInterval(() => {
      if (!startTimeRef.current || startCountdownRef.current === null) return;

      // Calculate actual elapsed time (seconds)
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const newCountdown = Math.max(0, startCountdownRef.current - elapsed);

      if (newCountdown <= 0) {
        updateState({ isSettling: true, countdown: 0 });
        clearInterval(timer);
      } else {
        // Keep one decimal place
        updateState({ countdown: Math.round(newCountdown * 10) / 10 });
      }
    }, 100);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBetting, updateState]);

  // When entering settling state, perform one refetch
  useEffect(() => {
    if (isSettling) {
      refetch();
    }
  }, [isSettling, refetch]);

  // Watch betList; when a result is found, update bettingResult
  useEffect(() => {
    if (!isSettling || !betList || !bettingOrderId) return;

    const currentBet = betList.find(bet => bet.orderId === bettingOrderId);
    if (currentBet) {
      const result = currentBet.win ? 'win' : 'lose';
      updateState({
        isSettling: false,
        bettingResult: result,
        closingPrice: currentBet.endPrice,
      });
    }
  }, [isSettling, betList, bettingOrderId, updateState]);

  // After a result appears, reset after 3s (separate effect to avoid interruption by betList polling)
  useEffect(() => {
    if (!bettingResult) return;

    const resetTimer = setTimeout(() => {
      reset();
    }, 3000);

    return () => clearTimeout(resetTimer);
  }, [bettingResult, reset]);

  // Compute ring progress: 100% if countdown not started; from 100% to 0% during countdown
  const progress = isBetting ? (countdown / totalCountdown) * 100 : 100;

  // Real-time win/lose prediction logic, not the final result
  const isWin =
    isBetting &&
    currentPrice !== undefined &&
    bettingPrice !== null &&
    ((bettingDirection === 'up' && currentPrice > parseFloat(bettingPrice)) ||
      (bettingDirection === 'down' && currentPrice < parseFloat(bettingPrice)));

  // Randomly select a smile icon (when real-time prediction is win)
  const randomSmileIcon = useMemo(() => {
    const smileIcons = [Smile1Icon, Smile2Icon, Smile3Icon];
    return smileIcons[Math.floor(Math.random() * smileIcons.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWin]); // Re-randomize when real-time prediction changes

  // Randomly select a scared icon (when real-time prediction is lose)
  const randomScaredIcon = useMemo(() => {
    const scaredIcons = [Scared1Icon, Scared2Icon, Scared3Icon];
    return scaredIcons[Math.floor(Math.random() * scaredIcons.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWin]); // Re-randomize when real-time prediction changes

  // Icon display logic: prioritize final result, then real-time prediction
  const img = bettingResult
    ? bettingResult === 'win'
      ? WinIcon
      : LoseIcon
    : isBetting
      ? isWin
        ? randomSmileIcon
        : randomScaredIcon
      : SolanaIcon;
  return (
    <div
      className={cn(
        'xs:px-6 relative rounded-[12px] bg-[#151515] px-2 pt-[30px] pb-[18px]',
        // Five mutually exclusive states, priority from high to low:
        // 1. Final result - Win (gold inner shadow)
        bettingResult === 'win' && 'shadow-[0_0_100px_0_#FFD900_inset]',
        // 2. Final result - Lose (gray inner shadow)
        bettingResult === 'lose' && 'shadow-[0_0_100px_0_#616161_inset]',
        // 3. Betting - Up (green animation)
        !bettingResult &&
          isBetting &&
          bettingDirection === 'up' &&
          'animate-pulse-glow-up',
        // 4. Betting - Down (red animation)
        !bettingResult &&
          isBetting &&
          bettingDirection === 'down' &&
          'animate-pulse-glow-down',
        // 5. Default state (black outer shadow)
        !bettingResult &&
          !isBetting &&
          'shadow-[0_0_20px_0_rgba(0,0,0,0.60)_inset]'
      )}
    >
      {isCurrentRoundEnded ? (
        <div className="flex h-32 items-center justify-center">
          <div className="font-doto text-center text-5xl leading-[42px] font-medium">
            <div className="text-[#F30] [text-shadow:0_0_12px_#F30]">
              Round {config.CURRENT_ROUND_ID} has ended,
            </div>
            <div className="mt-1.5 text-[#0F6] [text-shadow:0_0_12px_#0F6]">
              Round {BigInt(config.CURRENT_ROUND_ID) + BigInt(1)} is coming
              soon!
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="-ml-6 flex flex-1 flex-col items-center gap-[5px]">
            <div className="font-doto text-[22px] leading-[19px] font-medium text-[#F7931A]">
              Betting Price
            </div>
            <div className="text-center text-2xl leading-[1.5] font-semibold">
              {bettingPrice
                ? parseFloat(bettingPrice).toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })
                : '--'}
            </div>
          </div>
          <div
            className="relative flex aspect-square w-32 items-center justify-center"
            style={{
              opacity: isCheckingBetOnFly ? 0 : 1,
              transition: 'opacity 0.3s ease-in-out',
            }}
          >
            <svg
              className="absolute inset-0 rotate-180"
              width="100%"
              height="100%"
              viewBox="0 0 128 128"
            >
              <defs>
                <linearGradient
                  id="paint0_linear_952_320"
                  x1="6.70656"
                  y1="127.66"
                  x2="133.324"
                  y2="13.7068"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#00D18C" />
                  <stop offset="0.21" stopColor="#24B0A7" />
                  <stop offset="0.58" stopColor="#6377D6" />
                  <stop offset="0.86" stopColor="#8A53F4" />
                  <stop offset="1" stopColor="#9945FF" />
                </linearGradient>
              </defs>
              <circle
                cx="64"
                cy="64"
                r="61"
                fill="none"
                stroke="url(#paint0_linear_952_320)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 61}
                strokeDashoffset={-2 * Math.PI * 61 * (1 - progress / 100)}
                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
              />
            </svg>
            <img src={img} className="z-10 aspect-square w-26" />
          </div>
          <div className="-mr-6 flex flex-1 flex-col items-center gap-[5px]">
            <div className="font-doto text-[22px] leading-[19px] font-medium text-[#F7931A]">
              {bettingResult ? (
                'Closing Price'
              ) : (
                <span className="flex items-center gap-1">
                  {direction === 'up' ? (
                    <PriceUpIcon />
                  ) : direction === 'down' ? (
                    <PriceDownIcon />
                  ) : null}
                  Current Price
                </span>
              )}
            </div>
            <div
              className={`text-center text-2xl leading-[1.5] font-semibold ${direction === 'up' ? 'text-[#0F6]' : direction === 'down' ? 'text-[#F30]' : 'text-white'}`}
            >
              {(bettingResult
                ? parseFloat(closingPrice!)
                : currentPrice
              )?.toLocaleString('en-US', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      )}

      {isBetting ? (
        <div
          className={`font-doto mt-6 flex items-center justify-center gap-2 px-5 text-center text-[32px] leading-[28px] font-medium ${bettingResult && 'opacity-0'} ${bettingDirection === 'up' ? 'text-[#0F6]' : 'text-[#F30]'}`}
        >
          Betting {bettingDirection?.toUpperCase()} :{' '}
          <div>
            <span className="inline-block w-10">{countdown.toFixed(1)}</span>s
          </div>
          {isSettling && <div className="text-white/50">Settling...</div>}
        </div>
      ) : (
        <Marquee speed={50} gradient={false}>
          <div className="font-doto mt-6 px-5 text-[32px] leading-[28px] font-medium opacity-0">
            x402's First Pulse Predict: 1U In, 10s Reveal — Mint Your $10s
          </div>
        </Marquee>
      )}

      {bettingResult && (
        <div className="absolute bottom-[25px] left-1/2">
          {bettingResult === 'win' ? (
            <div className="animate-win-scale text-4xl leading-[1.5] font-bold text-[#ffd900] italic [text-shadow:0_0_12px_#FFD900]">
              You Win!
            </div>
          ) : (
            <div className="animate-lose-fade -translate-x-1/2 text-4xl leading-[1.5] font-bold text-[#818181] italic [text-shadow:0_0_12px_#616161]">
              You Lose
            </div>
          )}
        </div>
      )}

      {isHoveringUpButton && (
        <UpIcon className="animate-fade-in absolute top-5 left-1/2 z-20 -translate-x-1/2" />
      )}
      {isHoveringDownButton && (
        <DownIcon className="animate-fade-in absolute top-5 left-1/2 z-20 -translate-x-1/2" />
      )}
    </div>
  );
}

export default Dashboard;
