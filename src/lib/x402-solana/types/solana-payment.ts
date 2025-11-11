import { VersionedTransaction } from '@solana/web3.js';
import { SolanaNetwork } from './x402-protocol';
import type {
  PaymentMiddlewareConfig,
  SPLTokenAmount,
  RouteConfig,
} from 'x402/types';

/**
 * Solana-specific payment types
 */

// Re-export x402 types
export type { PaymentMiddlewareConfig, SPLTokenAmount, RouteConfig };

// Wallet adapter interface - framework agnostic
// Compatible with both Anza wallet-adapter and custom implementations
export interface WalletAdapter {
  publicKey?: { toString(): string }; // Anza wallet-adapter standard
  address?: string; // Alternative property
  signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>;
}

// Client configuration
export interface X402ClientConfig {
  wallet: WalletAdapter;
  network: SolanaNetwork;
  rpcUrl?: string;
  maxPaymentAmount?: bigint;
}
