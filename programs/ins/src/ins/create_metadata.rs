use crate::*;

#[derive(Accounts)]
pub struct CreateMetadata<'info> {
    #[account(mut, address = vault.authority)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [
            b"vault".as_ref(),
            authority.key().as_ref(),
        ],
        bump = vault.bump,
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    pub token_metadata_program: UncheckedAccount<'info>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    pub rent: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,

    pub system_program: Program<'info, System>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct CreateMetadataParams {
    name: String,
    symbol: String,
    uri: String,
}

impl CreateMetadata<'_> {
    pub fn handler(ctx: Context<Self>, params: CreateMetadataParams) -> Result<()> {
        let vault = &ctx.accounts.vault;

        let bump = vault.bump;
        let authority_key = ctx.accounts.authority.key();
        let seeds = [b"vault".as_ref(), authority_key.as_ref(), &[bump]];
        let signer = &[&seeds[..]];

        let creators = vec![Creator {
            address: ctx.accounts.vault.key().clone(),
            verified: false,
            share: 100,
        }];

        CreateMetadataAccountV3Cpi::new(
            &ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountV3CpiAccounts {
                metadata: &ctx.accounts.metadata.to_account_info(),
                mint: &ctx.accounts.mint.to_account_info(),
                mint_authority: &ctx.accounts.vault.to_account_info(),
                payer: &ctx.accounts.authority.to_account_info(),
                update_authority: (&ctx.accounts.vault.to_account_info(), true),
                system_program: &ctx.accounts.system_program.to_account_info(),
                rent: Some(&ctx.accounts.rent.to_account_info()),
            },
            CreateMetadataAccountV3InstructionArgs {
                data: DataV2 {
                    name: params.name,
                    symbol: params.symbol,
                    uri: params.uri,
                    seller_fee_basis_points: 0,
                    creators: Some(creators),
                    collection: None,
                    uses: None,
                },
                is_mutable: true,
                collection_details: None,
            },
        ).invoke_signed(signer)?;

        Ok(())
    }
}
