use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, SetAuthority, Token, TokenAccount};
use spl_token::instruction::AuthorityType;

use crate::state::*;

pub fn handler(ctx: Context<NewTreeNodeAccounts>, node_bump: u8) -> Result<()> {
    let node_pda = &mut ctx.accounts.node;

    node_pda.owner = *(ctx.accounts.user.to_account_info().key);
    node_pda.bump = node_bump;
    node_pda.parent_mint = Some(*(ctx.accounts.parent_mint.to_account_info().key));
    node_pda.children_mint = *(ctx.accounts.mint.to_account_info().key);

    token::set_authority(
        ctx.accounts.into_set_authority_context(),
        AuthorityType::AccountOwner,
        Some(*ctx.accounts.node.to_account_info().key),
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct NewTreeNodeAccounts<'info> {
    #[account(
        init,
        payer = user,
        space = TreeNode::space(),
        seeds = [
            NODE_PDA_SEED,
            mint.key().as_ref()
        ],
        bump
    )]
    pub node: Account<'info, TreeNode>,
    pub parent_mint: Account<'info, Mint>,
    pub mint: Account<'info, Mint>,
    #[account(
        mut,
        constraint = mint_token_account.amount == 1,
        constraint = mint_token_account.mint == mint.key(),
        constraint = mint_token_account.owner == user.key(),
    )]
    pub mint_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
}

impl<'info> NewTreeNodeAccounts<'info> {
    fn into_set_authority_context(&self) -> CpiContext<'_, '_, '_, 'info, SetAuthority<'info>> {
        let cpi_accounts = SetAuthority {
            account_or_mint: self.mint_token_account.to_account_info(),
            current_authority: self.user.to_account_info(),
        };

        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }
}
