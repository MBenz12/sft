import { BN, Program } from '@project-serum/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { SftVault } from 'idl/sft_vault';
import { getVaultPda } from './utils';
import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddressSync } from '@solana/spl-token';

export const getInitVaultInstruction = async (
  program: Program<SftVault>,
  authority: PublicKey,
  pieceMints: PublicKey[],
  fragmentMints: PublicKey[],
) => {
  const [vault] = getVaultPda(authority);

  return await program.methods
    .initialize(
      {
        pieceMints,
        fragmentMints,
      },
    )
    .accounts({
      authority,
      vault,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
}

export const getMintSftInstruction = async (
  program: Program<SftVault>,
  payer: PublicKey,
  fragmentMint: PublicKey,
  amount: BN,
) => {
  const [vault] = getVaultPda();
  const fragmentAta = getAssociatedTokenAddressSync(fragmentMint, payer);

  return await program.methods
    .mintSft({ amount, })
    .accounts({
      payer,
      vault,
      fragmentMint,
      fragmentAta,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
}

export const getCombineInstruction = async (
  program: Program<SftVault>,
  payer: PublicKey,
  fragmentMint: PublicKey,
  pieceMint: PublicKey,
  amount: BN,
) => {
  const [vault] = getVaultPda();
  const payerFragmentAta = getAssociatedTokenAddressSync(fragmentMint, payer);
  const vaultFragmentAta = getAssociatedTokenAddressSync(fragmentMint, vault, true);
  const pieceAta = getAssociatedTokenAddressSync(pieceMint, payer);

  return await program.methods
    .combine({ amount })
    .accounts({
      payer,
      vault,
      fragmentMint,
      pieceMint,
      payerFragmentAta,
      vaultFragmentAta,
      pieceAta,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
}

export const getCreateAtaInstruction = async (
  connection: Connection,
  payer: PublicKey,
  tokenMint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve?: boolean,
  programId?: PublicKey,
) => {
  const ata = getAssociatedTokenAddressSync(tokenMint, owner, allowOwnerOffCurve, programId);
  const ataData = await connection.getAccountInfo(ata);
  if (!ataData) {
      return createAssociatedTokenAccountInstruction(payer, ata, owner, tokenMint, programId);
  }

  return null;
}