import { PublicKey } from '@solana/web3.js';
import idl from 'idl/sft_vault.json';

export const Authority = new PublicKey("");

export const getVaultPda = (
  authority?: PublicKey,
  programId: PublicKey = new PublicKey(idl.metadata.address),
) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("vault"),
      (authority || Authority).toBuffer(),
    ],
    programId
  );
};