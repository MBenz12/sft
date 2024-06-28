use crate::*;

#[account]
pub struct Vault {
    pub bump: u8,

    pub authority: Pubkey,

    // 0: gold, 1: silver, 2: bronze
    pub piece_sfts: [Sft; 3],

    // 0: gold, 1: silver, 2: bronze
    pub fragment_sfts: [Sft; 3],

    pub price_per_sft: u64,

    pub sol_balance: u64,
}

#[derive(Debug, AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub struct Sft {
    pub mint: Pubkey,

    pub minted_amount: u64,

    pub total_supply: u64,
}

impl Vault {
    pub const LEN: usize = std::mem::size_of::<Vault>();
}

#[error_code]
pub enum CustomError {
    #[msg("Mint Not Found")]
    MintNotFound,
    #[msg("Exceeds Max Mintable Amount")]
    ExceedsMaxMintableAmount,
}
