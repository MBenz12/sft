mod ins;
mod state;

use ins::*;
use state::*;

use anchor_lang::prelude::*;
use anchor_spl::token::{
    mint_to, transfer_checked, Mint, MintTo, Token, TokenAccount, TransferChecked,
};
// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("FAn5KmM3XUDoZasfKQf4qny3NBDX8RBUjZSW3H7bYJyL");

#[program]
mod sft {
    use super::*;
    pub fn initialize(ctx: Context<InitVault>, params: InitVaultParams) -> Result<()> {
        InitVault::handler(ctx, params)
    }

    pub fn mint_sft(ctx: Context<MintSft>, params: MintSftParams) -> Result<()> {
        MintSft::handler(ctx, params)
    }

    pub fn combine(ctx: Context<Combine>, params: CombineParams) -> Result<()> {
        Combine::handler(ctx, params)
    }
}
