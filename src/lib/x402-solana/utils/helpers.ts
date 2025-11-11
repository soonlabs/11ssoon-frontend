import { VersionedTransaction } from '@solana/web3.js';

import { PaymentRequirements, SolanaNetwork } from '../types';

/**
 * Helper utilities for x402 payment processing
 */

/**
 * Create payment header from a signed transaction
 * Encodes transaction and payment details into base64 X-PAYMENT header
 */
export function createPaymentHeaderFromTransaction(
  transaction: VersionedTransaction,
  paymentRequirements: PaymentRequirements,
  x402Version: number
): string {
  // Serialize the signed transaction
  const serializedTransaction = Buffer.from(transaction.serialize()).toString(
    'base64'
  );

  // Create payment payload matching x402 spec
  const paymentPayload = {
    x402Version: x402Version,
    scheme: paymentRequirements.scheme,
    network: paymentRequirements.network,
    payload: {
      transaction: serializedTransaction,
    },
  };

  // Encode payment payload as base64 for X-PAYMENT header
  const paymentHeader = Buffer.from(JSON.stringify(paymentPayload)).toString(
    'base64'
  );

  return paymentHeader;
}

/**
 * Get default RPC URL for a given Solana network
 * @param network - Must be 'solana' or 'solana-devnet'
 * @returns Default RPC URL for the network
 */
export function getDefaultRpcUrl(network: SolanaNetwork): string {
  if (network === 'solana') {
    return 'https://solana-mainnet.g.alchemy.com/v2/1SMOMr-qJJbullsuZdLED';
  } else if (network === 'solana-devnet') {
    return 'https://api.devnet.solana.com';
  }
  // TypeScript ensures network is one of the two options, so this is unreachable
  throw new Error(`Unexpected network: ${network}`);
}

/**
 * Convert human-readable amount to token's smallest unit (atomic units)
 * @param amount - Human-readable amount (e.g., 2.5 for 2.5 USDC)
 * @param decimals - Token decimals (e.g., 6 for USDC, 9 for SOL)
 */
export function toAtomicUnits(amount: number, decimals: number): bigint {
  return BigInt(Math.floor(amount * Math.pow(10, decimals)));
}

/**
 * Convert token's atomic units to human-readable amount
 * @param atomicUnits - Token amount in smallest units
 * @param decimals - Token decimals (e.g., 6 for USDC, 9 for SOL)
 */
export function fromAtomicUnits(
  atomicUnits: bigint | number,
  decimals: number
): number {
  return Number(atomicUnits) / Math.pow(10, decimals);
}

// Legacy USDC-specific helpers (deprecated, use toAtomicUnits/fromAtomicUnits instead)
/** @deprecated Use toAtomicUnits(amount, 6) instead */
export function usdToMicroUsdc(usdAmount: number): number {
  return Math.floor(usdAmount * 1_000_000);
}

/** @deprecated Use fromAtomicUnits(microUsdc, 6) instead */
export function microUsdcToUsd(microUsdc: number): number {
  return microUsdc / 1_000_000;
}
