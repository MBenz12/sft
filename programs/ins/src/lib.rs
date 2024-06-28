mod ins;
mod state;

use ins::*;
use state::*;

use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::clock::Clock;
use anchor_spl::token::{
    burn, mint_to, transfer_checked, Burn, Mint, MintTo, Token, TokenAccount, TransferChecked,
};
use mpl_token_metadata::{
    instructions::{
        CreateMetadataAccountV3Cpi, CreateMetadataAccountV3CpiAccounts,
        CreateMetadataAccountV3InstructionArgs,
    },
    types::{Creator, DataV2},
};

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("FAn5KmM3XUDoZasfKQf4qny3NBDX8RBUjZSW3H7bYJyL");

#[program]
mod sft {
    use super::*;
    pub fn init_vault(ctx: Context<InitVault>, params: InitVaultParams) -> Result<()> {
        InitVault::handler(ctx, params)
    }

    pub fn create_metadata(
        ctx: Context<CreateMetadata>,
        params: CreateMetadataParams,
    ) -> Result<()> {
        CreateMetadata::handler(ctx, params)
    }

    pub fn mint_sft(ctx: Context<MintSft>, params: MintSftParams) -> Result<()> {
        MintSft::handler(ctx, params)
    }

    pub fn combine(ctx: Context<Combine>, params: CombineParams) -> Result<()> {
        Combine::handler(ctx, params)
    }

    pub fn split(ctx: Context<Split>, params: SplitParams) -> Result<()> {
        Split::handler(ctx, params)
    }

    pub fn withdraw(ctx: Context<Withdraw>, params: WithdrawParams) -> Result<()> {
        Withdraw::handler(ctx, params)
    }

    pub fn close_pda(ctx: Context<ClosePda>) -> Result<()> {
        ClosePda::handler(ctx)
    }
}
