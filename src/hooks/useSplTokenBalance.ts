import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
import { useAppKitAccount } from '@reown/appkit/react';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

export const useSplTokenBalance = (mintAddress?: string) => {
  const { connection } = useAppKitConnection();
  const { address, isConnected } = useAppKitAccount({ namespace: 'solana' });

  const { data: tokenAccounts } = useQuery({
    queryKey: [mintAddress, address, connection?.rpcEndpoint, 'tokenAccounts'],
    queryFn: () =>
      connection!.getTokenAccountsByOwner(new PublicKey(address!), {
        mint: new PublicKey(mintAddress!),
      }),
    enabled: !!address && !!mintAddress && isConnected && !!connection,
  });

  const tokenAccountKey = tokenAccounts?.value[0]?.pubkey;

  const { data: tokenBalance } = useQuery({
    queryKey: [
      tokenAccountKey?.toBase58(),
      connection?.rpcEndpoint,
      'tokenBalance',
    ],
    queryFn: () => connection!.getTokenAccountBalance(tokenAccountKey!),
    enabled: !!tokenAccountKey && isConnected && !!connection,
  });

  return tokenBalance?.value;
};
