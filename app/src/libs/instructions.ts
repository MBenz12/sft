import { BN, Program } from '@project-serum/anchor';
import { Connection, PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from '@solana/web3.js';
import { SftVault } from 'idl/sft_vault';
import { METADATA_PROGRAM_ID, getMetadata, getVaultPda } from './utils';
import { NATIVE_MINT, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddressSync } from '@solana/spl-token';

export const getInitVaultInstruction = async (
  program: Program<SftVault>,
  authority: PublicKey,
  pieceMints: PublicKey[],
  fragmentMints: PublicKey[],
  pricePerSft: BN,
) => {
  const [vault] = getVaultPda(authority);

  return await program.methods
    .initVault(
      {
        pieceMints,
        fragmentMints,
        pricePerSft,
      },
    )
    .accounts({
      authority,
      vault,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
}

export const getCreateMetadataInstruction = async (
  program: Program<SftVault>,
  authority: PublicKey,
  mint: PublicKey,
  name: string,
  symbol: string,
  uri: string,
) => {
  const [vault] = getVaultPda();
  const metadata = getMetadata(mint);

  return await program.methods
    .createMetadata({
      name,
      symbol,
      uri,
    })
    .accounts({
      authority,
      vault,
      mint,
      metadata,
      tokenMetadataProgram: METADATA_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
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
  const payerSolAta = getAssociatedTokenAddressSync(NATIVE_MINT, payer);
  const vaultSolAta = getAssociatedTokenAddressSync(NATIVE_MINT, vault, true);

  return await program.methods
    .mintSft({ amount, })
    .accounts({
      payer,
      vault,
      fragmentMint,
      fragmentAta,
      nativeMint: NATIVE_MINT,
      payerSolAta,
      vaultSolAta,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
}

export const getWithdrawInstruction = async (
  program: Program<SftVault>,
  authority: PublicKey,
  amount: BN,
) => {
  const [vault] = getVaultPda();
  const authoritySolAta = getAssociatedTokenAddressSync(NATIVE_MINT, authority);
  const vaultSolAta = getAssociatedTokenAddressSync(NATIVE_MINT, vault, false);

  return await program.methods
    .withdraw({ amount })
    .accounts({
      authority,
      vault,
      nativeMint: NATIVE_MINT,
      authoritySolAta,
      vaultSolAta,
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

export const getClosePdaInstruction = async (
  program: Program<SftVault>,
  authority: PublicKey,
  pda: PublicKey,
) => {
  return await program.methods
    .closePda()
    .accounts({
      signer: authority,
      pda,
      systemProgram: SystemProgram.programId
    })
    .instruction();
}
