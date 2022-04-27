mod instructions;
mod state;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("2xLDrcDhqtXeVPQE9Q9LmSqbc3aKXLzomA4BgrTGaHuB");

#[program]
pub mod sol998 {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn mint_hero_pre(
        ctx: Context<HeroMintPre>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        instructions::mint_hero::handler_pre(ctx, name, symbol, uri)
    }

    pub fn mint_hero(
        ctx: Context<HeroMint>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        instructions::mint_hero::handler(ctx, name, symbol, uri)
    }

    pub fn new_tree(ctx: Context<TreeNewAccounts>, node_bump: u8) -> Result<()> {
        instructions::tree_new::handler(ctx, node_bump)
    }

    pub fn tree_node_add(ctx: Context<NewTreeNodeAccounts>, node_bump: u8) -> Result<()> {
        instructions::tree_node_add::handler(ctx, node_bump)
    }

    pub fn tree_node_extract(ctx: Context<TreeNodeExtractAccounts>, node_bump: u8) -> Result<()> {
        instructions::tree_node_extract::handler(ctx, node_bump)
    }

    pub fn tree_node_transfer(ctx: Context<TreeNodeTransferAccounts>, node_bump: u8) -> Result<()> {
        instructions::tree_node_transfer::handler(ctx, node_bump)
    }

    pub fn destroy_tree(ctx: Context<TreeNodeDestroyAccounts>, node_bump: u8) -> Result<()> {
        instructions::tree_destroy::handler(ctx, node_bump)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
