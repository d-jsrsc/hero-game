use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, SetAuthority, Token, TokenAccount};
use spl_token::instruction::AuthorityType;

use crate::state::*;

pub fn handler(ctx: Context<TreeNodeDestroyAccounts>, node_bump: u8) -> Result<()> {
    let mint = ctx.accounts.mint.to_account_info().key();
    let user = ctx.accounts.user.to_account_info().key();
    let receiver = ctx.accounts.receiver.to_account_info().key();

    let remaining_pdas = ctx.remaining_accounts.iter();

    let node_pda = &mut ctx.accounts.node;

    node_pda.owner = receiver;

    for pda in remaining_pdas {
        let mut tree_node = Account::<TreeNode>::try_from(pda)?;
        assert_eq!(tree_node.owner, user.key());
        // require!(tree_node.owner, user)
        tree_node.owner = receiver
    }

    let seeds = &[NODE_PDA_SEED, mint.as_ref(), &[node_bump]];

    token::set_authority(
        ctx.accounts
            .into_set_authority_context()
            .with_signer(&[&seeds[..]]), // use extended priviledge from current instruction for CPI
        AuthorityType::AccountOwner,
        Some(*ctx.accounts.receiver.to_account_info().key),
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct TreeNodeDestroyAccounts<'info> {
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
    // #[account(mut)]
    pub mint_token_account: Account<'info, TokenAccount>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub receiver: AccountInfo<'info>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
}

impl<'info> TreeNodeDestroyAccounts<'info> {
    fn into_set_authority_context(&self) -> CpiContext<'_, '_, '_, 'info, SetAuthority<'info>> {
        let cpi_accounts = SetAuthority {
            account_or_mint: self.mint_token_account.to_account_info(),
            current_authority: self.node.to_account_info(),
        };

        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }
}
