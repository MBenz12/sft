use crate::*;

#[derive(Accounts)]
pub struct ClosePda<'info> {
    #[account(mut, address = "FtBFWcD8ZxakiAf7d4CoTV8dzL6JauP5eRrzQpDJgxmX".parse::<Pubkey>().unwrap())]
    pub signer: Signer<'info>,

    /// CHECK:
    #[account(mut)]
    pub pda: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

impl ClosePda<'_> {
    pub fn handler(ctx: Context<Self>) -> Result<()> {
        let dest_account_info = ctx.accounts.signer.to_account_info();
        let source_account_info = ctx.accounts.pda.to_account_info();
        let dest_starting_lamports = dest_account_info.lamports();
        **dest_account_info.lamports.borrow_mut() = dest_starting_lamports
            .checked_add(source_account_info.lamports())
            .unwrap();
        **source_account_info.lamports.borrow_mut() = 0;

        Ok(())
    }
}
