use crate::*;

#[derive(Accounts)]
pub struct InitVault<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        seeds = [
            b"vault".as_ref(),
            authority.key().as_ref(),
        ],
        bump,
        space = Vault::LEN + 8,
    )]
    pub vault: Account<'info, Vault>,

    pub system_program: Program<'info, System>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct InitVaultParams {
    piece_mints: [Pubkey; 3],

    fragment_mints: [Pubkey; 3],
}

impl InitVault<'_> {
    pub fn handler(ctx: Context<Self>, params: InitVaultParams) -> Result<()> {
        let vault = &mut ctx.accounts.vault;

        vault.bump = ctx.bumps.vault.clone();
        vault.authority = ctx.accounts.authority.key();

        const TOTAL_SUPPLIES: [u64; 3] = [200, 500, 1000];

        for i in 0..3 {
            vault.piece_sfts[i] = Sft {
                mint: params.piece_mints[i],
                total_supply: TOTAL_SUPPLIES[i],
                minted_amount: 0,
            };

            vault.fragment_sfts[i] = Sft {
                mint: params.fragment_mints[i],
                total_supply: TOTAL_SUPPLIES[i] * 10,
                minted_amount: 0,
            }
        }

        vault.sol_balance = 0;

        Ok(())
    }
}
