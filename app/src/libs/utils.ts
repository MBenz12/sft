import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import idl from 'idl/sft_vault.json';

export const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

export const Authority = new PublicKey("FtBFWcD8ZxakiAf7d4CoTV8dzL6JauP5eRrzQpDJgxmX");

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

export const getMetadata = (mint: PublicKey) => {
  const [metadata] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    METADATA_PROGRAM_ID
  );
  return metadata;
}

export const sendAndConfirmTransaction = async (
  connection: Connection,
  wallet: WalletContextState,
  transaction: Transaction,
  signers?: Keypair[]
) => {
  if (!wallet.publicKey) return;
  try {
    transaction.feePayer = wallet.publicKey
    transaction.recentBlockhash = (await connection.getLatestBlockhash('finalized')).blockhash;
    const txSignature = await wallet.sendTransaction(transaction, connection, { skipPreflight: true, signers });
    await connection.confirmTransaction(txSignature, "confirmed");

    console.log(txSignature);
    return txSignature;
  } catch (error) {
    console.log(error);
    return null;
  }
}


export const sendAndConfirmTransactions = async (
  connection: Connection,
  wallet: WalletContextState,
  transactions: Transaction[],
  signers?: Keypair[]
) => {
  if (!wallet.publicKey || !wallet.signAllTransactions) return;
  try {
    for (let i = 0; i < transactions.length; i += 50) {
      const recentBlockhash = (await connection.getLatestBlockhash('finalized')).blockhash;
      const someTxns = transactions.slice(i, i + 50);
      for (const transaction of someTxns) {
        console.log(transaction.instructions);
        if (!transaction.feePayer) {
          transaction.feePayer = wallet.publicKey;
        }
        if (!transaction.recentBlockhash) {
          transaction.recentBlockhash = recentBlockhash;
        }
        if (signers) {
          transaction.partialSign(...signers);
        }
      }
      const signedTxns = await wallet.signAllTransactions(someTxns);
      const txSignatures = await Promise.all(signedTxns.map(async (signedTxn) => {
        const txSignature = await connection.sendRawTransaction(signedTxn.serialize(), { skipPreflight: true });
        return txSignature;
      }));
      await Promise.all(txSignatures.map(async (txSignature) => {
        await connection.confirmTransaction(txSignature, "confirmed");
        console.log(txSignature);
      }));
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
