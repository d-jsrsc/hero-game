use anchor_lang::{prelude::*, AccountsClose};
use anchor_spl::token::{self, Mint, SetAuthority, Token, TokenAccount};
use spl_token::instruction::AuthorityType;

use crate::state::*;

pub fn handler(ctx: Context<TreeNodeExtractAccounts>, node_bump: u8) -> Result<()> {
    let mint = ctx.accounts.mint.to_account_info().key();
    let user = ctx.accounts.user.to_account_info().key();

    let node_pda = &mut ctx.accounts.node;

    let remaining_pdas = ctx.remaining_accounts;

    if !remaining_pdas.is_empty() {
        node_pda.owner = user;
    } else {
        node_pda.close(ctx.accounts.user.to_account_info())?;
        let seeds = &[NODE_PDA_SEED, mint.as_ref(), &[node_bump]];
        token::set_authority(
            ctx.accounts
                .into_set_authority_context()
                .with_signer(&[&seeds[..]]), // use extended priviledge from current instruction for CPI
            AuthorityType::AccountOwner,
            Some(user),
        )?;
    }

    Ok(())
}

#[derive(Accounts)]
pub struct TreeNodeExtractAccounts<'info> {
    #[account(
        mut,
        seeds = [
            NODE_PDA_SEED,
            mint.key().as_ref()
        ],
        bump
    )]
    pub node: Account<'info, TreeNode>,

    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub mint_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
}

impl<'info> TreeNodeExtractAccounts<'info> {
    fn into_set_authority_context(&self) -> CpiContext<'_, '_, '_, 'info, SetAuthority<'info>> {
        let cpi_accounts = SetAuthority {
            account_or_mint: self.mint_token_account.to_account_info(),
            current_authority: self.node.to_account_info(),
        };

        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }
}
