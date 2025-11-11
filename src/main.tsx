import React from 'react';
import { createRoot } from 'react-dom/client';
import { CaipNetworkId, createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';

import { initResponsive } from './lib/responsive.ts';
import AppRouter from './AppRouter.tsx';
import config from './config/index.ts';
import './index.css';

initResponsive();

type CustomRpcUrl = {
  url: string;
};

type CustomRpcUrlMap = Record<CaipNetworkId, CustomRpcUrl[]>;

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.reown.com
const projectId = config.WALLET_CONNECT_PROJECT_ID;

// 2. Create a metadata object - optional
const metadata = config.WALLET_CONNECT_METADATA;

// 3. Set the networks
const networks = config.networks;

// Configure customRpcUrls based on environment
const customRpcUrls: CustomRpcUrlMap =
  config.SVM_NETWORK === 'solana'
    ? {
        'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': [
          { url: config.SOLANA_RPC_URL },
        ],
      }
    : {
        'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1': [
          { url: config.SOLANA_RPC_URL },
        ],
      };

// 4. Create Solana Adapter
const solanaWeb3JsAdapter = new SolanaAdapter();

// 5. Create modal
createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    connectMethodsOrder: ['wallet'],
  },
  customRpcUrls,
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  </React.StrictMode>
);
