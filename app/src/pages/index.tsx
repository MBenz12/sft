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
  const [selectedAction, setSelectedAction] = useState<"combine" | "divide">("combine");
  const [selectedType, setSelectedType] = useState(0);
  const [values, setValues] = useState<{ [key: string]: any }>({
    mintAmount: 0,
    actionAmount: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    let value = parseInt(e.target.value) || 0;
    setValues({
      ...values,
      [e.target.name]: value,
    });
  }


  const handleMintSft = async () => {
    if (!program || !vault) return;

    if (!values.mintAmount) return;

    await mintSft(wallet, program, vault, new BN(values.mintAmount))
    setReload({});
  }

  const handleAction = async () => {
    if (!program || !vault) return;

    const amount = values.actionAmount;
    if (!amount) return;

    setLoading(true);

    if (selectedAction === "combine") {
      await combine(wallet, program, vault, selectedType, new BN(amount));
    } else {
      await split(wallet, program, vault, selectedType, new BN(amount));
    }

    setLoading(false);
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

      <div className='grid sm:grid-cols-2 grid-cols-1 gap-4 mt-5'>
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
              className="rounded-md bg-gray-800 hover:bg-gray-600 w-10 h-10"
              disabled={values.mintAmount === 0}
              onClick={() => setValues({ ...values, mintAmount: Math.max(0, values.mintAmount - 10) })}
            >
              {"-"}
            </button>
            <input
              className='bg-transparent rounded-md border border-white/30 py-2'
              name='mintAmount'
              value={values.mintAmount}
              onChange={handleChange}
              min={0}
            />
            <button
              className="rounded-md bg-gray-800 hover:bg-gray-600 w-10 h-10"
              onClick={() => setValues({ ...values, mintAmount: values.mintAmount + 10 })}
            >
              {"+"}
            </button>
          </div>
          <button
            className="rounded-md bg-gray-800 hover:bg-gray-600 w-full p-2"
            onClick={handleMintSft}
          >
            MINT
          </button>
        </div>
      </div>
      <div className='mt-4 mb-14 border border-white/30 rounded-lg p-5 grid md:grid-cols-4 gap-3 items-center'>
        <select
          value={selectedAction}
          onChange={(e) => {
            setSelectedAction(e.target.value as "combine" | "divide");
            setValues({ ...values, actionAmount: 0 });
          }}
          className='bg-transparent border border-white/30 rounded-md p-2'
        >
          <option value={"combine"}>Combine</option>
          <option value={"divide"}>Divide</option>
        </select>
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(parseInt(e.target.value));
            setValues({ ...values, actionAmount: 0 });
          }}
          className='bg-transparent border border-white/30 rounded-md p-2'
        >
          {Array(3).fill(0).map((_, index: number) =>
            <option value={index} key={index}>
              {["Gold", "Silver", "Bronze"][index]} {selectedAction === "combine" ? "Fragments" : "Pieces"}
            </option>
          )}
        </select>
        <input
          className='bg-transparent rounded-md border border-white/30 w-full p-2'
          name='actionAmount'
          type='number'
          value={values.actionAmount}
          onChange={handleChange}
          min={0}
          max={balances[(selectedAction === "combine" ? 0 : 1) * 3 + selectedType] / (selectedAction === "combine" ? 10 : 1)}
        />
        <button
          className="rounded-md bg-gray-800 hover:bg-gray-600 w-full py-2"
          onClick={handleAction}
          disabled={loading}
        >
          {selectedAction === "combine" ? "Combine" : "Divide"}
        </button>
      </div>
    </div>
  );
}