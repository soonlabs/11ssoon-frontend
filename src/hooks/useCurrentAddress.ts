import { useAppKitAccount } from '@reown/appkit/react';

import { getAssociatedTokenAddress } from '@/utils/solana';
import config from '@/config';

export const useCurrentAddress = () => {
  const { address: solanaAddress } = useAppKitAccount({ namespace: 'solana' });

  if (config.SVM_NETWORK === 'solana-devnet') {
    return solanaAddress;
  }
  return (
    solanaAddress &&
    getAssociatedTokenAddress(solanaAddress, config.SOLANA_USDC_ADDRESS)
  );
};
