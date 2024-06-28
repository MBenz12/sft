import { useState, useEffect, useCallback } from 'react';
import { Vault } from 'types';
import useProgram from './useProgram';
import { getVaultPda } from 'libs/utils';
import { useWallet } from '@solana/wallet-adapter-react';

const useFetchVault = (reload: {}) => {
  const [vault, setVault] = useState<Vault>();
  const program = useProgram();
  const { publicKey } = useWallet();

  const fetchVault = useCallback(async () => {
    if (!program || !publicKey) return;
    try {
      const [vault] = getVaultPda();
      const vaultData = await program.account.vault.fetchNullable(vault) as Vault;
      if (vaultData) {
        setVault(vaultData);
      } else {
        setVault(undefined);
      }
    } catch (error) {
      console.log(error);
    }
  }, [program, publicKey]);

  useEffect(() => {
    fetchVault();
  }, [program, fetchVault, reload]);

  return { vault };
};

export default useFetchVault;