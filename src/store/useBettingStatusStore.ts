import { create } from 'zustand';

interface BettingStatusState {
  isBetting: boolean;
  countdown: number;
  totalCountdown: number;
  isSettling: boolean;
  bettingDirection: 'up' | 'down' | null;
  bettingResult: 'win' | 'lose' | null;
  bettingPrice: string | null;
  closingPrice: string | null;
  bettingOrderId: string | null;
  updateState: (
    updates: Partial<Omit<BettingStatusState, 'updateState' | 'reset'>>
  ) => void;
  reset: () => void;
}

const useBettingStatusStore = create<BettingStatusState>(set => ({
  isBetting: false,
  countdown: 0,
  totalCountdown: 10,
  isSettling: false,
  bettingDirection: null,
  bettingResult: null,
  bettingPrice: null,
  closingPrice: null,
  bettingOrderId: null,
  updateState: updates => set(updates),
  reset: () =>
    set({
      isBetting: false,
      countdown: 0,
      isSettling: false,
      bettingDirection: null,
      bettingResult: null,
      bettingPrice: null,
      closingPrice: null,
      bettingOrderId: null,
    }),
}));

export default useBettingStatusStore;
