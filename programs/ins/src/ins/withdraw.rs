use crate::*;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, address = vault.authority)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [
            b"vault".as_ref(),
            vault.authority.as_ref(),
        ],
        bump = vault.bump,
    )]
    pub vault: Account<'info, Vault>,

    pub native_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::authority = authority,
        associated_token::mint = native_mint,
    )]
    pub authority_sol_ata: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::authority = vault,
        associated_token::mint = native_mint,
    )]
    pub vault_sol_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct WithdrawParams {
    amount: u64,
}

impl Withdraw<'_> {
    pub fn handler(ctx: Context<Self>, params: WithdrawParams) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.sol_balance -= params.amount;

        let bump = vault.bump;
        let authority_key = ctx.accounts.authority.key();
        let seeds = [b"vault".as_ref(), authority_key.as_ref(), &[bump]];
        let signer = &[&seeds[..]];

        transfer_checked(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from: ctx.accounts.vault_sol_ata.to_account_info(),
                    to: ctx.accounts.authority_sol_ata.to_account_info(),
                    authority: ctx.accounts.vault.to_account_info(),
                    mint: ctx.accounts.native_mint.to_account_info(),
                },
                signer,
            ),
            params.amount,
            9,
        )?;

        Ok(())
    }
}
