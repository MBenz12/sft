import { AnchorProvider, Program } from '@project-serum/anchor';
import { useState, useEffect } from 'react';
import { IDL, SftVault } from 'idl/sft_vault';
import idl from 'idl/sft_vault.json';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';

const useProgram = () => {
    const anchorWallet = useAnchorWallet();
    const { connection } = useConnection();
    const [program, setProgram] = useState<Program<SftVault>>();

    useEffect(() => {
        if (!connection || !anchorWallet) return;
        const provider = new AnchorProvider(connection, anchorWallet, { preflightCommitment: "processed" });
        const program = new Program(IDL, idl.metadata.address, provider);
        setProgram(program);
    }, [anchorWallet, connection]);
    
    return program;
};

export default useProgram;