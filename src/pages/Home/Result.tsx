import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import ResultLoseSvg from '@/assets/result-lose.svg';
import ResultStarSvg from '@/assets/result-star.svg';
import { useBetList } from '@/hooks/useBetList';
import { useCurrentAddress } from '@/hooks/useCurrentAddress';
import { useResponsive } from '@/hooks/useResponsive';
import useBettingStatusStore from '@/store/useBettingStatusStore';

interface ResultItemProps {
  // Direction: 'up' or 'down'
  direction: 'up' | 'down';
  // Amount won (e.g., 5000)
  amount: number;
  // Token symbol (e.g., '$11s')
  tokenSymbol?: string;
}

const WinResultItem = ({
  direction,
  amount,
  tokenSymbol = '$11s',
}: ResultItemProps) => {
  // Format amount with comma separator
  const formattedAmount = amount.toLocaleString();

  // Color based on direction
  const directionColor = direction === 'up' ? '#00FF66' : '#FF3300';

  return (
    <div
      className="relative h-[70px] w-[203px] shrink-0 md:w-[210px]"
      data-name="up win"
    >
      {/* Background with border and shadow */}
      <div className="absolute inset-0 rounded-[30px] border-2 border-[#ffd900] bg-[rgba(0,0,0,0.8)]">
        {/* Inner shadow effect */}
        <div className="pointer-events-none absolute inset-0 rounded-[25px] shadow-[0px_0px_16px_2px_inset_#ffd900]" />
      </div>

      {/* Mask group image */}
      <div className="absolute inset-0" data-name="Mask group">
        <img
          alt=""
          className="block h-full w-full max-w-none rounded-[30px] object-cover"
          src={ResultStarSvg}
        />
        <p className="absolute right-6 bottom-6.5 rotate-[-15deg] text-sm leading-[16px] font-semibold text-white">
          +{formattedAmount} {tokenSymbol}
        </p>
      </div>

      {/* Direction label (up/down) */}
      <div className="font-poppins absolute inset-0 flex items-center justify-start">
        <section className="flex flex-col justify-center gap-[3px] pl-[18px]">
          <div className="flex items-baseline gap-[3px]">
            <span
              className="text-[14px] leading-[14px] font-bold uppercase"
              style={{ color: directionColor }}
            >
              {direction}
            </span>
            <span className="text-[20px] leading-[20px] font-bold text-[#ffd900] italic">
              Win
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};

const LoseResultItem = ({ direction }: ResultItemProps) => {
  // Color based on direction
  const directionColor = direction === 'up' ? '#00FF66' : '#FF3300';

  return (
    <div
      className="relative w-[203px] shrink-0 md:w-[210px]"
      data-name="up lose"
    >
      {/* Background with border */}
      <div className="absolute inset-0 rounded-[30px] border-2 border-[rgba(255,255,255,0.2)] bg-[#292929]" />

      {/* Content layer: flex layout, space-between */}
      <div className="font-poppins absolute inset-0 flex items-center justify-between">
        <section className="flex flex-col justify-center gap-[3px] pl-[18px]">
          <div className="flex items-baseline gap-[3px]">
            <span
              className="text-[14px] leading-[14px] font-bold uppercase"
              style={{ color: directionColor }}
            >
              {direction}
            </span>
            <span className="text-[20px] leading-[20px] font-bold text-white italic opacity-40">
              Lose
            </span>
          </div>
          {/* <p className="text-[16px] leading-[16px] font-semibold text-white opacity-60">
            -{formattedAmount} {tokenSymbol}
          </p> */}
        </section>

        <div className="mr-[30px] h-[32px] w-[27px]">
          <img
            alt=""
            className="block h-full w-full max-w-none"
            src={ResultLoseSvg}
          />
        </div>
      </div>
    </div>
  );
};

const EmptyResultItem = ({ kind }: { kind: 'NULL_WIN' | 'NULL_LOSE' }) => {
  return kind === 'NULL_WIN' ? (
    <div className="xs:w-[210px] h-[70px] w-[203px] shrink-0 bg-[url('@/assets/win-ph.png')] bg-contain bg-no-repeat opacity-30"></div>
  ) : (
    <div className="xs:w-[210px] h-[70px] w-[203px] shrink-0 bg-[url('@/assets/lose-ph.png')] bg-contain bg-no-repeat opacity-30"></div>
  );
};

type ResultModel = {
  // WIN or LOSE item
  kind: 'WIN' | 'LOSE' | 'NULL_WIN' | 'NULL_LOSE';
  // Direction: 'up' | 'down'
  direction: 'up' | 'down';
  // Amount number shown on the card
  amount: number;
  // Token symbol label
  tokenSymbol: string;
  // Unique id for rendering keys
  id: number | string;
};

type TriggerAdd = (items: ResultModel[]) => void;

function SlideList({
  ref,
  renderItem,
}: {
  ref: React.RefObject<{ triggerAdd: TriggerAdd }>;
  renderItem: (item: ResultModel) => React.ReactNode;
}) {
  const { isMobile } = useResponsive();
  // Constants used to compute slide distance
  // NOTE: Keep in sync with card width (211px) and gap (10px => gap-2.5)
  const CARD_WIDTH_PX = isMobile ? 203 : 211;
  const GAP_PX = 10;
  const SLIDE_DISTANCE = CARD_WIDTH_PX + GAP_PX; // one card width + one gap

  // Visible list (exactly 3 items)
  const [visible, setVisible] = useState<ResultModel[]>([
    { id: -2, kind: 'NULL_WIN', direction: 'up', amount: 0, tokenSymbol: '' },
    { id: -1, kind: 'NULL_LOSE', direction: 'up', amount: 0, tokenSymbol: '' },
  ]);

  const [incoming, setIncoming] = useState<ResultModel[] | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isAnimatingRef = useRef(false);
  const queueRef = useRef<ResultModel[][]>([]);

  const triggerAdd: TriggerAdd = useCallback(
    (items: ResultModel[]) => {
      const next: ResultModel[] = items;
      if (isAnimatingRef.current || incoming) {
        queueRef.current.push(next);
        return;
      }
      setIncoming(next);
    },
    [incoming]
  );

  const handleTransitionEnd = useCallback(() => {
    if (!isAnimatingRef.current || !incoming) return;
    const updated = [...incoming, ...visible];
    setVisible(updated);
    setIncoming(null);
    if (queueRef.current.length > 0) {
      const nextBatch = queueRef.current.shift()!;
      setIncoming(nextBatch);
    } else {
      isAnimatingRef.current = false;
    }
  }, [incoming, visible]);

  // When incoming changes, drive the slide purely via DOM (simpler state)
  useLayoutEffect(() => {
    if (!incoming || !trackRef.current) return;
    const el = trackRef.current;
    // Pre-shift left without transition
    el.style.transition = 'none';
    el.style.transform = `translateX(-${SLIDE_DISTANCE}px)`;
    // Force reflow to ensure the browser applies the pre-state
    void el.offsetHeight;
    // Animate back to 0
    isAnimatingRef.current = true;
    el.style.transition = 'transform 500ms ease';
    el.style.transform = 'translateX(0px)';
  }, [incoming, SLIDE_DISTANCE]);

  // Items to render in the track (3 visible + optional incoming)
  const trackItems: ResultModel[] = useMemo(() => {
    // For left-to-right, new item is placed on the left side during animation
    return incoming ? [...incoming, ...visible] : visible;
  }, [incoming, visible]);

  useImperativeHandle(
    ref as React.RefObject<{
      triggerAdd: TriggerAdd;
    }>,
    () => ({ triggerAdd }),
    [triggerAdd]
  );

  return (
    <section className="overflow-hidden rounded-[12px] bg-[#151515] p-2.5">
      <div
        ref={trackRef}
        className="flex gap-2.5 will-change-transform"
        onTransitionEnd={handleTransitionEnd}
      >
        {trackItems.map(item => renderItem(item))}
      </div>
    </section>
  );
}

const Result = () => {
  const ref = useRef<{ triggerAdd: TriggerAdd }>(null);
  const currentAddress = useCurrentAddress();
  const { data } = useBetList();
  const prevOrderIds = useRef(new Set<string>());
  const betList = data?.betList.slice(0, 2);
  const countdown = useBettingStatusStore(state => state.countdown);
  const isSettling = useBettingStatusStore(state => state.isSettling);

  useEffect(() => {
    // Do not update the list during countdown or settling
    // Although countdown changes frequently, early return has minimal cost
    if (countdown > 0 || isSettling) {
      return;
    }

    const addItems: ResultModel[] = [];
    // diff prevOrderIds and betList
    betList?.forEach(item => {
      if (!prevOrderIds.current.has(item.orderId)) {
        if (item.win) {
          addItems.push({
            kind: 'WIN',
            id: item.orderId,
            direction: item.direction,
            amount: 1, // Fixed
            tokenSymbol: '$11s', // Fixed
          });
        } else {
          addItems.push({
            kind: 'LOSE',
            id: item.orderId,
            direction: item.direction,
            amount: 1, // Fixed
            tokenSymbol: 'USDC', // Fixed
          });
        }
      }
    });

    if (addItems.length > 0) {
      const sortedItems = addItems.sort((a, b) => Number(b.id) - Number(a.id));
      ref.current?.triggerAdd(sortedItems);
    }

    prevOrderIds.current = new Set(betList?.map(item => item.orderId));
  }, [betList, countdown, isSettling]);

  const renderItem = (item: ResultModel) => {
    switch (item.kind) {
      case 'WIN':
        return (
          <WinResultItem
            key={item.id}
            direction={item.direction}
            amount={item.amount}
            tokenSymbol={item.tokenSymbol}
          />
        );
      case 'LOSE':
        return (
          <LoseResultItem
            key={item.id}
            direction={item.direction}
            amount={item.amount}
            tokenSymbol={item.tokenSymbol}
          />
        );
      case 'NULL_WIN':
      case 'NULL_LOSE':
        return <EmptyResultItem key={item.id} kind={item.kind} />;
      default:
        return null;
    }
  };

  return (
    <SlideList
      key={currentAddress}
      ref={
        ref as React.RefObject<{
          triggerAdd: TriggerAdd;
        }>
      }
      renderItem={renderItem}
    />
  );
};

export default Result;
