/* eslint-disable react-hooks/exhaustive-deps */
import { BN } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import useProgram from 'hooks/useProgram';
import { mintSft, combine } from 'libs/methods';
import { useState } from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useFetchVault from 'hooks/useFetchVault';

export default function Home() {
  const wallet = useWallet();
  const program = useProgram();
  const [reload, setReload] = useState({});
  const { vault } = useFetchVault(reload);
  const [amount, setAmount] = useState(0);

  // console.log(vault?.fragmentSfts.map(sft => sft.mint.toString()));

  const handleMintSft = async () => {
    if (!program || !vault) return;

    await mintSft(wallet, program, vault, new BN(amount))
    setReload({});
  }

  const handleCombine = async (index: number) => {
    if (!program || !vault) return;

    await combine(wallet, program, vault, index, new BN(amount));
    setReload({});
  }

  return (
    <div className='flex flex-col gap-2'>
      <div>
        <WalletMultiButton />
      </div>
      {vault && <>
          Amount: <input value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0.0)} type="number" />
          <button onClick={handleMintSft}>Mint</button>
          {vault.fragmentSfts.map((sft, index) => (
            <div key={index} className='flex gap-2 items-center'>
              {["Gold", "Silver", "Bronze"][index]}: {sft.mintedAmount.toString()} 
              <button onClick={() => handleCombine(index)}>Combine</button>
            </div>
          ))}
        </>
      }
    </div>
  )
}
