import { BN, Program } from '@project-serum/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { getCombineInstruction, getCreateAtaInstruction, getInitVaultInstruction, getMintSftInstruction } from './instructions';
import { SftVault } from 'idl/sft_vault';
import { getVaultPda } from './utils';
import { Vault } from 'types';
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint } from '@solana/spl-token';

export async function initialize(
  wallet: WalletContextState,
  program: Program<SftVault>,
) {
  if (!wallet.publicKey) return;
  try {
    const transaction = new Transaction();
    const [vault] = getVaultPda(wallet.publicKey);


    // Define piece mints and fragment mints with their respective parameters
    const pieceMints: { mint: Keypair; totalSupply: number; decimals: number }[] = [
      {
        mint: Keypair.generate(), // Generate new Keypair for mint
        totalSupply: 200,
        decimals: 0,
      },
      {
        mint: Keypair.generate(),
        totalSupply: 500,
        decimals: 0,
      },
      {
        mint: Keypair.generate(),
        totalSupply: 1000,
        decimals: 0,
      },
    ];

    const fragmentMints: { mint: Keypair; totalSupply: number; decimals: number }[] = [
      {
        mint: Keypair.generate(),
        totalSupply: 2000,
        decimals: 0,
      },
      {
        mint: Keypair.generate(),
        totalSupply: 5000,
        decimals: 0,
      },
      {
        mint: Keypair.generate(),
        totalSupply: 10000,
        decimals: 0,
      },
    ];


    transaction.add(
      await getInitVaultInstruction(
        program,
        wallet.publicKey,
        pieceMints.map((m) => m.mint.publicKey),
        fragmentMints.map((m) => m.mint.publicKey)
      )
    );

    const lamports =  await getMinimumBalanceForRentExemptMint(program.provider.connection);

    // Create mint accounts and initialize them
    const mintInstructions: TransactionInstruction[] = [
      ...[...pieceMints, ...fragmentMints].map((mint) => 
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey!,
          newAccountPubkey: mint.mint.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        })
      ),
      ...[...pieceMints, ...fragmentMints].map((mint) =>
        createInitializeMintInstruction(
          mint.mint.publicKey,
          0, // Decimals
          vault, // Mint authority
          vault, // Freeze authority
        )
      ),
    ];

    // Add mint creation instructions to the transaction
    transaction.add(...mintInstructions);

    const txSignature = await wallet.sendTransaction(transaction, program.provider.connection, { skipPreflight: true });
    await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    return txSignature;
  } catch (error) {
    console.log(error);
    return;
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
    const transaction = new Transaction();

    // const [vault] = getVaultPda();
    // const vaultData = await program.account.vault.fetchNullable(vault) as Vault;

    // if (!vaultData) {
    //   return;
    // }

    const index = Math.floor(Math.random() * 1000) % 3;

    const fragmentMint: PublicKey = vaultData.fragmentSfts[index].mint;

    const ix = await getCreateAtaInstruction(program.provider.connection, wallet.publicKey, fragmentMint, wallet.publicKey);

    if (ix) {
      transaction.add(ix);
    }

    transaction.add(
      await getMintSftInstruction(program, wallet.publicKey, fragmentMint, amount)
    );

    const txSignature = await wallet.sendTransaction(transaction, program.provider.connection, { skipPreflight: true });
    await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    return txSignature;
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

    const txSignature = await wallet.sendTransaction(transaction, program.provider.connection, { skipPreflight: true });
    await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    return txSignature;
  } catch (error) {
    console.log(error);
    return;
  }
}
