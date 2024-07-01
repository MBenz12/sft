/* eslint-disable react-hooks/exhaustive-deps */
import { BN } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import useProgram from 'hooks/useProgram';
import { mintSft, combine, split } from 'libs/methods';
import { useState } from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useFetchVault from 'hooks/useFetchVault';

export default function Home() {
  const wallet = useWallet();
  const program = useProgram();
  const [reload, setReload] = useState({});
  const { vault } = useFetchVault(reload);
  const [values, setValues] = useState<{ [key: string]: any }>({
    mintAmount: 0,
    combineAmounts: [0, 0, 0],
    splitAmounts: [0, 0, 0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    let value = parseInt(e.target.value);
    if (["combineAmounts", "splitAmounts"].includes(e.target.name)) {
      const amounts = [...values[e.target.name]];
      amounts[index!] = value;
      setValues({
        ...values,
        [e.target.name]: amounts,
      });
    } else {
      setValues({
        ...values,
        [e.target.name]: value,
      });
    }
  }

  // console.log(vault?.fragmentSfts.map(sft => sft.mint.toString()));

  const handleMintSft = async () => {
    if (!program || !vault) return;

    if (!values.mintAmount) return;
    
    await mintSft(wallet, program, vault, new BN(values.mintAmount))
    setReload({});
  }

  const handleCombine = async (index: number) => {
    if (!program || !vault) return;

    const amount = values.combineAmounts[index];
    if (!amount) return;

    await combine(wallet, program, vault, index, new BN(amount));
    setReload({});
  }

  const handleSplit = async (index: number) => {
    if (!program || !vault) return;

    const amount = values.splitAmounts[index];
    if (!amount) return;
    
    await split(wallet, program, vault, index, new BN(amount));
    setReload({});
  }

  return (
    <div className='flex flex-col gap-2'>
      <div>
        <WalletMultiButton />
      </div>
      {vault && <>
        Amount: <input name="mintAmount" value={values.mintAmount} onChange={handleChange} type="number" min={0} />
        <button onClick={handleMintSft}>Mint</button>
        {vault.fragmentSfts.map((sft, index) => (
          <div key={index} className='flex gap-2 items-center'>
            {["Gold", "Silver", "Bronze"][index]}: {sft.mintedAmount.toString()} Fragment(s), {vault.pieceSfts[index].mintedAmount.toString()} Piece(s)
            <input
              name='combineAmounts'
              value={values.combineAmounts[index]}
              onChange={(e) => handleChange(e, index)}
              type="number"
              min={0}
              max={vault.fragmentSfts[index].mintedAmount / 10}
            />
            <button onClick={() => handleCombine(index)}>Combine</button>
            <input
              name='splitAmounts'
              value={values.splitAmounts[index]}
              onChange={(e) => handleChange(e, index)}
              type="number"
              min={0}
              max={vault.pieceSfts[index].mintedAmount}
            />
            <button onClick={() => handleSplit(index)}>Split</button>
          </div>
        ))}
      </>
      }
    </div>
  )
}
