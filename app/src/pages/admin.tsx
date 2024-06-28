/* eslint-disable react-hooks/exhaustive-deps */
import { useWallet } from '@solana/wallet-adapter-react';
import useProgram from 'hooks/useProgram';
import { closeVault, createMetadatas, initVault, withdraw } from 'libs/methods';
import { useState } from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useFetchVault from 'hooks/useFetchVault';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';

export default function Admin() {
  const wallet = useWallet();
  const program = useProgram();
  const [reload, setReload] = useState({});
  const { vault } = useFetchVault(reload);
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);

  const handleInitializeVault = async () => {
    if (!program) return;
    await initVault(wallet, program, new BN(price * LAMPORTS_PER_SOL));
    setReload({});
  }

  const handleCreateMetadatas = async () => {
    if (!program || !vault) return;
    await createMetadatas(wallet, program, vault);
    setReload({});
  }

  const handleCloseVault = async () => {
    if (!program) return;
    await closeVault(wallet, program);
    setReload({});
  }

  const handleWithdraw = async () => {
    if (!program || !vault) return;

    await withdraw(wallet, program, vault, new BN(amount));
    setReload({});
  }

  return (
    <div className='flex flex-col gap-2'>
      <WalletMultiButton />
      Price Per SFT:
      <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0.0)} />
      {!vault && <button onClick={handleInitializeVault}>Initialize</button>}
      {vault &&
        <div className='flex flex-col gap-2'>
        <button onClick={handleCreateMetadatas}>Create Metadatas</button>

          <button onClick={handleCloseVault}>Close Vault</button>
          <div>Sol Balance: {(vault.solBalance.toNumber() / LAMPORTS_PER_SOL).toLocaleString('en-us')}</div>
          <div className="flex gap-2 items-center">
            <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0.0)} />
            <button onClick={handleWithdraw}>Withraw</button>
          </div>
          <div className="flex flex-col gap-1 ml-5">

          </div>
        </div>
      }
    </div>
  )
}