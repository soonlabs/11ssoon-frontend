import { useCallback } from 'react';
import { useAppKitProvider } from '@reown/appkit/react';
import { Provider } from '@reown/appkit-adapter-solana';

import { createX402Client, WalletAdapter } from '@/lib/x402-solana/client';
import config from '@/config';

export const useX402FetchWithPay = () => {
  const { walletProvider: solanaWalletProvider } =
    useAppKitProvider<Provider>('solana');

  const solanaFetchWithPay = useCallback(
    async (url: string, options: RequestInit) => {
      // Create x402 client
      if (!solanaWalletProvider) {
        throw new Error('Wallet not connected');
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const account = (solanaWalletProvider as any).wallet?.accounts[0];

      const signer: WalletAdapter = {
        publicKey: account.address,
        address: account.address,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        signTransaction: async (transaction: any) => {
          return await solanaWalletProvider.signTransaction(transaction);
        },
      };

      // Create x402 client
      const client = createX402Client({
        wallet: signer,
        network: config.SVM_NETWORK,
        maxPaymentAmount: BigInt(1 * 10 ** 6), // Optional: max 1 USDC
      });

      // Make a paid request - automatically handles 402 payments
      return await client.fetch(url, options);
    },
    [solanaWalletProvider]
  );

  return solanaFetchWithPay;
};
