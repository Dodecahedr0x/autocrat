use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::*;

use crate::state::*;

#[derive(Accounts)]
pub struct RemoveLiquidity<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub dao: Account<'info, Dao>,
    #[account(zero, signer)]
    pub proposal: Box<Account<'info, Proposal>>,
    #[account(mut)]
    pub amm: Account<'info, Amm>,
    #[account(mut)]
    pub amm_position: Account<'info, AmmPosition>,
    pub conditional_base_mint: Account<'info, Mint>,
    pub conditional_quote_mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_ata_conditional_base: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_ata_conditional_quote: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_ata_conditional_base: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_ata_conditional_quote: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handle(
    ctx: Context<RemoveLiquidity>,
    remove_bps: u64,
) -> Result<()> {

    // TODO

    Ok(())
}
