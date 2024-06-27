use crate::*;

#[derive(Accounts)]
pub struct MintSft<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mut,
        seeds = [
            b"vault".as_ref(),
            vault.authority.as_ref(),
        ],
        bump = vault.bump,
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut, 
        constraint = vault.fragment_sfts.iter().any(|sft| sft.mint == fragment_mint.key()) @ CustomError::MintNotFound
    )]
    pub fragment_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::authority = payer,
        associated_token::mint = fragment_mint,

    )]
    pub fragment_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct MintSftParams {
    amount: u64,
}

impl MintSft<'_> {
    pub fn handler(ctx: Context<Self>, params: MintSftParams) -> Result<()> {
        let vault = &mut ctx.accounts.vault;

        let mint_key = ctx.accounts.fragment_mint.key();
        let amount_to_mint = params.amount;

        // Find the SFT in the fragment_sfts array
        let sft = vault
            .fragment_sfts
            .iter_mut()
            .find(|sft| sft.mint == mint_key)
            .ok_or(CustomError::MintNotFound)?;

        let max_mintable_amount = sft.total_supply * 80 / 100;

        require!(
            sft.minted_amount + amount_to_mint <= max_mintable_amount,
            CustomError::ExceedsMaxMintableAmount
        );

        sft.minted_amount += amount_to_mint;

        mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.fragment_mint.to_account_info(),
                    to: ctx.accounts.fragment_ata.to_account_info(),
                    authority: ctx.accounts.vault.to_account_info(),
                },
            ),
            amount_to_mint,
        )?;

        Ok(())
    }
}
