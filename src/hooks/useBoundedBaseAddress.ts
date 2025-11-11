import { useAppKitAccount } from '@reown/appkit/react';
import { useQuery } from '@tanstack/react-query';

import ENDPOINTS from '@/api';
import { getAssociatedTokenAddress } from '@/utils/solana';
import config from '@/config';

export const useBoundedBaseAddress = () => {
  const { address: solanaAddress, isConnected: isSolanaConnected } =
    useAppKitAccount({ namespace: 'solana' });

  const solanaAddressWithAta =
    solanaAddress &&
    (config.SVM_NETWORK === 'solana-devnet'
      ? solanaAddress
      : getAssociatedTokenAddress(solanaAddress, config.SOLANA_USDC_ADDRESS));

  const { data, ...rest } = useQuery({
    queryKey: ['boundedBaseAddress', solanaAddressWithAta],
    queryFn: () =>
      fetch(
        `${ENDPOINTS.getBoundedBaseAddress}?address=${solanaAddressWithAta}`
      )
        .then(res => res.json())
        .then((data: { code: number; data: { address: string } }) => {
          if (data.code !== 0) {
            return null;
          }
          return data.data.address;
        }),
    enabled: !!solanaAddressWithAta,
    staleTime: 20_000,
  });

  return {
    shouldShowBindDialog: isSolanaConnected && typeof data !== 'string',
    memeOwnerAddress: data,
    ...rest,
  };
};
