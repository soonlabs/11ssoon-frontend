import { AppKitNetwork, solanaDevnet } from '@reown/appkit/networks';

export default {
  API_BASE_URL: 'https://api.nonprod.11ssoon.com',
  networks: [solanaDevnet] as [AppKitNetwork, ...AppKitNetwork[]],

  SOLANA_USDC_ADDRESS: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
  SOLANA_11S_SOON_ADDRESS: '3ooCv4CbVCFZdyWbcDjSMSmqBZBZNTPjLSHXBtfGAMM6',

  SVM_NETWORK: 'solana-devnet',

  CURRENT_ROUND_ID: BigInt(4004),

  SOLANA_RPC_URL:
    'https://solana-devnet.g.alchemy.com/v2/1SMOMr-qJJbullsuZdLED',
} as const;
