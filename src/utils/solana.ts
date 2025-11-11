import { PublicKey } from '@solana/web3.js';

/**
 * Official Solana SPL Token Program ID
 * This is the fixed system program address for managing all SPL Tokens
 */
const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
);

/**
 * Official Solana Associated Token Account Program ID
 * This is the fixed system program address used to derive ATA addresses
 */
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
);

/**
 * Manually compute ATA (Associated Token Account) address
 * This is a deterministic computation, no RPC call required
 *
 * @param ownerAddress The user's main address
 * @param mintAddress Token mint address (e.g., USDC)
 * @returns ATA address
 */
export const getAssociatedTokenAddress = (
  ownerAddress: string,
  mintAddress: string
): string => {
  const owner = new PublicKey(ownerAddress);
  const mint = new PublicKey(mintAddress);

  // Derive ATA address
  const [ata] = PublicKey.findProgramAddressSync(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  return ata.toBase58();
};
