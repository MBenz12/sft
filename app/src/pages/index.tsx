/* eslint-disable react-hooks/exhaustive-deps */
import { BN } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import useProgram from 'hooks/useProgram';
import { mintSft, combine, split } from 'libs/methods';
import { useState } from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useFetchVault from 'hooks/useFetchVault';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import SftCard from 'components/SftCard';

export default function Home() {
  const wallet = useWallet();
  const { connected } = wallet;
  const program = useProgram();
  const [reload, setReload] = useState({});
  const { vault, balances } = useFetchVault(reload);
  const [values, setValues] = useState<{ [key: string]: any }>({
    mintAmount: 0,
    combineAmounts: [0, 0, 0],
    splitAmounts: [0, 0, 0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    let value = parseInt(e.target.value) || 0;
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

  if (!connected || !vault) {
    return (
      <div className='flex flex-col container mx-auto p-4 min-h-screen items-center justify-center'>
        <WalletMultiButton />
      </div>
    );
  }

  return (
    <div className='flex flex-col container mx-auto px-4'>
      <div className='my-5 ml-auto'>
        <WalletMultiButton />
      </div>

      <div className='grid sm:grid-cols-2 grid-cols-1 gap-4 mt-10'>
        <div className='border border-white/30 rounded-lg p-5 flex flex-col gap-3 items-center justify-center'>
          <p>Gold Piece: 10 Gold Fragment</p>
          <p>Silver Piece: 10 Silver Fragment</p>
          <p>Bronze Piece: 10 Bronze Fragment</p>
        </div>
        <div className='border border-white/30 rounded-lg p-5 flex flex-col gap-2 items-center justify-center'>
          <h3 className='text-lg font-bold mb-4'>My Owned SFTs</h3>
          {balances.map((balance, index) => (
            <p key={`balance-${index}`} className=''>
              {[
                "Gold Fragment",
                "Silver Fragment",
                "Bronze Fragment",
                "Gold Piece",
                "Silver Piece",
                "Bronze Piece",
              ][index]}: {balance}
            </p>
          ))}
        </div>
      </div>
      <div className='mt-4 border border-white/30 rounded-lg p-5 flex flex-col gap-3 items-center justify-center'>
        <h1 className='text-2xl font-bold mb-4'>Mint Fragment SFT(<span className='text-lg'>{vault?.pricePerSft.toNumber() / LAMPORTS_PER_SOL}SOL</span>)</h1>

        <div className='my-5 grid md:grid-cols-3 grid-cols-1 w-full'>
          <SftCard type={0} vault={vault} />
          <SftCard type={1} vault={vault} />
          <SftCard type={2} vault={vault} />
        </div>

        <div className='flex flex-col items-center gap-4'>
          <div className='flex items-center gap-2'>
            <button
              className="rounded-md bg-gray-800 hover:bg-gray-600 w-8 h-8"
              disabled={values.mintAmount === 0}
              onClick={() => setValues({ ...values, mintAmount: Math.max(0, values.mintAmount - 10) })}
            >
              {"-"}
            </button>
            <input
              className='bg-transparent rounded-md border border-white/30'
              name='mintAmount'
              value={values.mintAmount}
              onChange={handleChange}
              min={0}
            />
            <button
              className="rounded-md bg-gray-800 hover:bg-gray-600 w-8 h-8"
              onClick={() => setValues({ ...values, mintAmount: values.mintAmount + 10 })}
            >
              {"+"}
            </button>
          </div>
          <button
            className="rounded-md bg-gray-800 hover:bg-gray-600 w-full py-2"
            onClick={handleMintSft}
          >
            MINT
          </button>
        </div>
      </div>
      <div className='mt-4 mb-10 border border-white/30 rounded-lg p-5 flex flex-col gap-3 items-center justify-center'>
          
      </div>
    </div>
  );

  // return (
  //   <div className='flex flex-col gap-2'>
  //     <div>
  //       <WalletMultiButton />
  //     </div>
  //     {vault && <>
  //       Amount: <input name="mintAmount" value={values.mintAmount} onChange={handleChange} type="number" min={0} />
  //       <button onClick={handleMintSft}>Mint</button>
  //       {vault.fragmentSfts.map((sft, index) => (
  //         <div key={index} className='flex gap-2 items-center'>
  //           {["Gold", "Silver", "Bronze"][index]}: {sft.mintedAmount.toString()}/{sft.totalSupply.toNumber()} Fragment(s), {vault.pieceSfts[index].mintedAmount.toString()}/{vault.pieceSfts[index].totalSupply.toString()} Piece(s)
  //           <input
  //             name='combineAmounts'
  //             value={values.combineAmounts[index]}
  //             onChange={(e) => handleChange(e, index)}
  //             type="number"
  //             min={0}
  //             max={vault.fragmentSfts[index].mintedAmount / 10}
  //           />
  //           <button onClick={() => handleCombine(index)}>Combine</button>
  //           <input
  //             name='splitAmounts'
  //             value={values.splitAmounts[index]}
  //             onChange={(e) => handleChange(e, index)}
  //             type="number"
  //             min={0}
  //             max={vault.pieceSfts[index].mintedAmount}
  //           />
  //           <button onClick={() => handleSplit(index)}>Split</button>
  //         </div>
  //       ))}
  //     </>
  //     }
  //   </div>
  // )
}
