import { create } from 'zustand';

interface RoundState {
  currentRound: number;
  isCurrentRoundEnded: boolean;
  updateState: (updates: Partial<RoundState>) => void;
}

const useRoundStore = create<RoundState>(set => ({
  currentRound: 1,
  isCurrentRoundEnded: false,
  updateState: updates => set(updates as Partial<RoundState>),
}));

export default useRoundStore;
