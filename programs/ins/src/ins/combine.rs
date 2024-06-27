use crate::*;

#[derive(Accounts)]
pub struct Combine<'info> {
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
        constraint = vault.piece_sfts.iter().any(|sft| sft.mint == piece_mint.key()) @ CustomError::MintNotFound
    )]
    pub piece_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::authority = payer,
        associated_token::mint = fragment_mint,

    )]
    pub payer_fragment_ata: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::authority = vault,
        associated_token::mint = fragment_mint,

    )]
    pub vault_fragment_ata: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::authority = payer,
        associated_token::mint = piece_mint,

    )]
    pub piece_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct CombineParams {
    amount: u64,
}

impl Combine<'_> {
    pub fn handler(ctx: Context<Self>, params: CombineParams) -> Result<()> {
        let vault = &ctx.accounts.vault;
        let fragment_mint_key = ctx.accounts.fragment_mint.key();
        let piece_mint_key = ctx.accounts.piece_mint.key();
        let amount = params.amount;

        // Find the index of the fragment_mint in the fragment_sfts array
        let fragment_index = vault
            .fragment_sfts
            .iter()
            .position(|sft| sft.mint == fragment_mint_key)
            .ok_or(CustomError::MintNotFound)?;

        // Ensure the corresponding piece_sft has the correct mint
        require!(
            vault.piece_sfts[fragment_index].mint == piece_mint_key,
            CustomError::MintNotFound
        );

        // Mint the specified amount of piece_mint to piece_ata
        mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.piece_mint.to_account_info(),
                    to: ctx.accounts.piece_ata.to_account_info(),
                    authority: ctx.accounts.vault.to_account_info(),
                },
            ),
            amount,
        )?;

        // Transfer amount * 10 of fragment_mint from payer_fragment_ata to vault_fragment_ata
        transfer_checked(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from: ctx.accounts.payer_fragment_ata.to_account_info(),
                    to: ctx.accounts.vault_fragment_ata.to_account_info(),
                    authority: ctx.accounts.payer.to_account_info(),
                    mint: ctx.accounts.fragment_mint.to_account_info(),
                },
            ),
            amount * 10,
            0,
        )?;

        let vault = &mut ctx.accounts.vault;
        // Update the minted_amount in piece_sfts
        vault.piece_sfts[fragment_index].minted_amount += amount;

        Ok(())
    }
}
