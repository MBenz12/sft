import { BN, Program } from '@project-serum/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { getClosePdaInstruction, getCombineInstruction, getCreateAtaInstruction, getCreateMetadataInstruction, getInitVaultInstruction, getMintSftInstruction, getWithdrawInstruction } from './instructions';
import { SftVault } from 'idl/sft_vault';
import { getVaultPda, sendAndConfirmTransaction, sendAndConfirmTransactions } from './utils';
import { Sft, Vault } from 'types';
import { MINT_SIZE, NATIVE_MINT, TOKEN_PROGRAM_ID, createCloseAccountInstruction, createInitializeMintInstruction, createSyncNativeInstruction, getAssociatedTokenAddressSync, getMinimumBalanceForRentExemptMint } from '@solana/spl-token';

const metadatas = [
  {
    name: "Gold Piece",
    symbol: "GP",
    uri: "https://nftstorage.link/ipfs/bafybeidcejwdiaey23n6b7lo2fr5m7qvumrr54cwibxnrpqx7rjach3gim/2934.json",
  },
  {
    name: "Silver Piece",
    symbol: "SP",
    uri: "https://nftstorage.link/ipfs/bafybeidcejwdiaey23n6b7lo2fr5m7qvumrr54cwibxnrpqx7rjach3gim/2935.json",
  },
  {
    name: "Bronze Piece",
    symbol: "BP",
    uri: "https://nftstorage.link/ipfs/bafybeidcejwdiaey23n6b7lo2fr5m7qvumrr54cwibxnrpqx7rjach3gim/2936.json",
  },
  {
    name: "Gold Fragment",
    symbol: "GF",
    uri: "https://nftstorage.link/ipfs/bafybeidcejwdiaey23n6b7lo2fr5m7qvumrr54cwibxnrpqx7rjach3gim/2937.json",
  },
  {
    name: "Silver Fragment",
    symbol: "SF",
    uri: "https://nftstorage.link/ipfs/bafybeidcejwdiaey23n6b7lo2fr5m7qvumrr54cwibxnrpqx7rjach3gim/2938.json",
  },
  {
    name: "Bronze Fragment",
    symbol: "BF",
    uri: "https://nftstorage.link/ipfs/bafybeidcejwdiaey23n6b7lo2fr5m7qvumrr54cwibxnrpqx7rjach3gim/2939.json",
  },
]

export async function initVault(
  wallet: WalletContextState,
  program: Program<SftVault>,
  pricePerSft: BN,
) {
  if (!wallet.publicKey) return;
  try {
    const [vault] = getVaultPda(wallet.publicKey);

    // Define piece mints and fragment mints with their respective parameters
    const pieceMints: Keypair[] = [
      Keypair.generate(), // Generate new Keypair for mint
      Keypair.generate(),
      Keypair.generate(),
    ];

    const fragmentMints: Keypair[] = [
      Keypair.generate(), // Generate new Keypair for mint
      Keypair.generate(),
      Keypair.generate(),
    ];


    const txns = [];

    const lamports = await getMinimumBalanceForRentExemptMint(program.provider.connection);
    // Create mint accounts and initialize them
    const mintInstructions: TransactionInstruction[] = [
      ...pieceMints.map((mint) =>
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey!,
          newAccountPubkey: mint.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        })
      ),
      ...pieceMints.map((mint) =>
        createInitializeMintInstruction(
          mint.publicKey,
          0, // Decimals
          vault, // Mint authority
          vault, // Freeze authority
        )
      ),
      ...fragmentMints.map((mint) =>
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey!,
          newAccountPubkey: mint.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        })
      ),
      ...fragmentMints.map((mint) =>
        createInitializeMintInstruction(
          mint.publicKey,
          0, // Decimals
          vault, // Mint authority
          vault, // Freeze authority
        )
      ),
    ];

    // Add mint creation instructions to the transaction
    for (let i = 0; i < 2; i++) {
      const txn = new Transaction().add(...mintInstructions.slice(i * 6, (i + 1) * 6));
      txn.feePayer = wallet.publicKey;
      const recentBlockhash = (await program.provider.connection.getLatestBlockhash('finalized')).blockhash;
      txn.recentBlockhash = recentBlockhash;
      txn.partialSign(...[pieceMints, fragmentMints][i]);
      txns.push(txn);
    }

    txns.push(new Transaction().add(
      await getInitVaultInstruction(
        program,
        wallet.publicKey,
        pieceMints.map((m) => m.publicKey),
        fragmentMints.map((m) => m.publicKey),
        pricePerSft,
      ))
    );

    await sendAndConfirmTransactions(program.provider.connection, wallet, txns);
  } catch (error) {
    console.log(error);
    return;
  }
}

export const createMetadatas = async (wallet: WalletContextState,
  program: Program<SftVault>,
  vaultData: Vault,
) => {
  if (!wallet.publicKey) return;
  try {
    const txns = [];
    
    const ixns: TransactionInstruction[] = [];
    await Promise.all([...vaultData.pieceSfts, ...vaultData.fragmentSfts].map(async (sft: Sft, index: number) => {
      const { name, symbol, uri } = metadatas[index];
      ixns.push(
        await getCreateMetadataInstruction(
          program,
          wallet.publicKey!,
          sft.mint,
          name,
          symbol,
          uri,
        )
      )
    }));

    txns.push(new Transaction().add(...ixns.slice(0, 3)));
    txns.push(new Transaction().add(...ixns.slice(3)));
    
    await sendAndConfirmTransactions(program.provider.connection, wallet, txns);
  } catch (error) {
    console.log(error);
  }
}

export async function mintSft(
  wallet: WalletContextState,
  program: Program<SftVault>,
  vaultData: Vault,
  amount: BN,
) {
  if (!wallet.publicKey) return;
  try {
    const connection = program.provider.connection;
    const payer = wallet.publicKey;
    const transaction = new Transaction();

    const [vault] = getVaultPda();

    const index = Math.floor(Math.random() * 1000) % 3;

    const fragmentMint: PublicKey = vaultData.fragmentSfts[index].mint;

    [
      await getCreateAtaInstruction(connection, payer, fragmentMint, payer),
      await getCreateAtaInstruction(connection, payer, NATIVE_MINT, payer),
      await getCreateAtaInstruction(connection, payer, NATIVE_MINT, vault, true),
    ].forEach(ix => ix && transaction.add(ix));

    const payerSolAta = getAssociatedTokenAddressSync(NATIVE_MINT, payer);

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: payerSolAta,
        lamports: amount * vaultData.pricePerSft
      }),
      createSyncNativeInstruction(payerSolAta)
    );

    transaction.add(
      await getMintSftInstruction(program, wallet.publicKey, fragmentMint, amount)
    );

    return sendAndConfirmTransaction(connection, wallet, transaction);
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function withdraw(
  wallet: WalletContextState,
  program: Program<SftVault>,
  vaultData: Vault,
  amount: BN,
) {
  if (!wallet.publicKey) return;
  try {
    const connection = program.provider.connection;
    const authority = vaultData.authority;
    const transaction = new Transaction();

    [
      await getCreateAtaInstruction(connection, authority, NATIVE_MINT, authority),
    ].forEach(ix => ix && transaction.add(ix));

    const auhtoritySolAta = getAssociatedTokenAddressSync(NATIVE_MINT, authority);

    transaction.add(
      await getWithdrawInstruction(program, authority, amount)
    );

    transaction.add(
      createCloseAccountInstruction(
        auhtoritySolAta,
        authority,
        authority,
      )
    );

    return sendAndConfirmTransaction(connection, wallet, transaction);
  } catch (error) {
    console.log(error);
    return;
  }
}


export async function combine(
  wallet: WalletContextState,
  program: Program<SftVault>,
  vaultData: Vault,
  index: number,
  amount: BN,
) {
  if (!wallet.publicKey) return;
  try {
    const transaction = new Transaction();
    const connection = program.provider.connection;
    const [vault] = getVaultPda();
    const fragmentMint = vaultData.fragmentSfts[index].mint;
    const pieceMint = vaultData.pieceSfts[index].mint;

    [
      await getCreateAtaInstruction(connection, wallet.publicKey, fragmentMint, wallet.publicKey),
      await getCreateAtaInstruction(connection, wallet.publicKey, fragmentMint, vault, true),
      await getCreateAtaInstruction(connection, wallet.publicKey, pieceMint, wallet.publicKey),
    ].forEach(ix => ix && transaction.add(ix));

    transaction.add(
      await getCombineInstruction(program, wallet.publicKey, fragmentMint, pieceMint, amount)
    );

    return sendAndConfirmTransaction(connection, wallet, transaction);
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function closeVault(
  wallet: WalletContextState,
  program: Program<SftVault>,
) {
  if (!wallet.publicKey) return;
  try {
    const [vault] = getVaultPda();

    const transaction = new Transaction().add(
      await getClosePdaInstruction(
        program,
        wallet.publicKey,
        vault,
      )
    );

    return sendAndConfirmTransaction(program.provider.connection, wallet, transaction);
  } catch (error) {
    console.log(error);
  }
}