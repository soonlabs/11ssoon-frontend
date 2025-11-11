import { create } from 'zustand';

interface ButtonHoverStatusState {
  isHoveringUpButton: boolean;
  isHoveringDownButton: boolean;
  setIsHoveringUpButton: (isHoveringUpButton: boolean) => void;
  setIsHoveringDownButton: (isHoveringDownButton: boolean) => void;
}

const useButtonHoverStatusStore = create<ButtonHoverStatusState>(set => ({
  isHoveringUpButton: false,
  isHoveringDownButton: false,
  setIsHoveringUpButton: (isHoveringUpButton: boolean) =>
    set({ isHoveringUpButton }),
  setIsHoveringDownButton: (isHoveringDownButton: boolean) =>
    set({ isHoveringDownButton }),
}));

export default useButtonHoverStatusStore;
