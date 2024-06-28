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
        constraint = vault.fragment_sfts.iter().any(|sft| sft.mint == gold_fragment_mint.key()) @ CustomError::MintNotFound
    )]
    pub gold_fragment_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::authority = payer,
        associated_token::mint = gold_fragment_mint,
    )]
    pub gold_fragment_ata: Account<'info, TokenAccount>,

    #[account(
        mut, 
        constraint = vault.fragment_sfts.iter().any(|sft| sft.mint == silver_fragment_mint.key()) @ CustomError::MintNotFound
    )]
    pub silver_fragment_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::authority = payer,
        associated_token::mint = silver_fragment_mint,
    )]
    pub silver_fragment_ata: Account<'info, TokenAccount>,

    #[account(
        mut, 
        constraint = vault.fragment_sfts.iter().any(|sft| sft.mint == bronze_fragment_mint.key()) @ CustomError::MintNotFound
    )]
    pub bronze_fragment_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::authority = payer,
        associated_token::mint = bronze_fragment_mint,
    )]
    pub bronze_fragment_ata: Account<'info, TokenAccount>,

    pub native_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::authority = payer,
        associated_token::mint = native_mint,
    )]
    pub payer_sol_ata: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::authority = vault,
        associated_token::mint = native_mint,
    )]
    pub vault_sol_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct MintSftParams {
    amount: u64,
}

impl MintSft<'_> {
    pub fn handler(ctx: Context<Self>, params: MintSftParams) -> Result<()> {
        let vault = &mut ctx.accounts.vault;

        let bump = vault.bump;
        let authority_key = vault.authority;
        let seeds = [b"vault".as_ref(), authority_key.as_ref(), &[bump]];
        let signer = &[&seeds[..]];

        let rand_index = (Clock::get().unwrap().unix_timestamp as usize) % 3;
        let amount_to_mint = params.amount;

        // Find the SFT in the fragment_sfts array
        let sft = &mut vault.fragment_sfts[rand_index];

        let max_mintable_amount = sft.total_supply * 80 / 100;

        require!(
            sft.minted_amount + amount_to_mint <= max_mintable_amount,
            CustomError::ExceedsMaxMintableAmount
        );

        sft.minted_amount += amount_to_mint;
        let total_price = vault.price_per_sft * amount_to_mint;
        vault.sol_balance += total_price;

        let mint_accounts = [
            ctx.accounts.gold_fragment_mint.to_account_info(),
            ctx.accounts.silver_fragment_mint.to_account_info(),
            ctx.accounts.bronze_fragment_mint.to_account_info(),
        ];

        let to_accounts = [
            ctx.accounts.gold_fragment_ata.to_account_info(),
            ctx.accounts.silver_fragment_ata.to_account_info(),
            ctx.accounts.bronze_fragment_ata.to_account_info(),
        ];

        mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: mint_accounts[rand_index].clone(),
                    to: to_accounts[rand_index].clone(),
                    authority: ctx.accounts.vault.to_account_info(),
                },
                signer,
            ),
            amount_to_mint,
        )?;

        transfer_checked(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from: ctx.accounts.payer_sol_ata.to_account_info(),
                    to: ctx.accounts.vault_sol_ata.to_account_info(),
                    authority: ctx.accounts.payer.to_account_info(),
                    mint: ctx.accounts.native_mint.to_account_info(),
                },
            ),
            total_price,
            9,
        )?;

        Ok(())
    }
}
