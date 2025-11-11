import { solana, AppKitNetwork } from '@reown/appkit/networks';

export default {
  API_BASE_URL: 'https://api.11ssoon.com',
  networks: [solana] as [AppKitNetwork, ...AppKitNetwork[]],

  SOLANA_USDC_ADDRESS: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  SOLANA_11S_SOON_ADDRESS: '3ooCv4CbVCFZdyWbcDjSMSmqBZBZNTPjLSHXBtfGAMM6',

  SVM_NETWORK: 'solana',

  CURRENT_ROUND_ID: BigInt(2),

  SOLANA_RPC_URL:
    'https://solana-mainnet.g.alchemy.com/v2/1SMOMr-qJJbullsuZdLED',
} as const;
