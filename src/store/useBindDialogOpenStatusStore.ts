import { create } from 'zustand';

interface BindDialogOpenStatusState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const useBindDialogOpenStatusStore = create<BindDialogOpenStatusState>(set => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}));

export default useBindDialogOpenStatusStore;
