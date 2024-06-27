import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';

export type Vault = {
  bump: number,
  authority: PublicKey,
  pieceSfts: Sft[],
  fragmentSfts: Sft[],
  solBalance: BN,
}

export type Sft = {
  mint: PublicKey,
  mintAmount: BN,
  totalSupply: BN,
};