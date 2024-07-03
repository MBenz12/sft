import { useState, useEffect, useCallback } from 'react';
import { Vault } from 'types';
import useProgram from './useProgram';
import { getVaultPda } from 'libs/utils';
import { useWallet } from '@solana/wallet-adapter-react';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';

const useFetchVault = (reload: {}) => {
  const [vault, setVault] = useState<Vault>();
  const program = useProgram();
  const { publicKey } = useWallet();
  const [balances, setBalances] = useState<number[]>(Array(6).fill(0));

  const fetchVault = useCallback(async () => {
    if (!program || !publicKey) return;
    try {
      const [vault] = getVaultPda();
      const vaultData = await program.account.vault.fetchNullable(vault) as Vault;
      if (vaultData) {
        setVault(vaultData);
        setBalances(await Promise.all([...vaultData.fragmentSfts, ...vaultData.pieceSfts].map(async (sft) => {
          const ata = getAssociatedTokenAddressSync(sft.mint, publicKey);
          try {
            const { value: { uiAmount } } = await program.provider.connection.getTokenAccountBalance(ata);
            return uiAmount || 0;
          } catch (error) {
            return 0;
          }
        })))
      } else {
        setVault(undefined);
        setBalances(Array(6).fill(0));
      }
    } catch (error) {
      console.log(error);
    }
  }, [program, publicKey]);

  useEffect(() => {
    fetchVault();
  }, [program, fetchVault, reload]);

  return { vault, balances };
};

export default useFetchVault;