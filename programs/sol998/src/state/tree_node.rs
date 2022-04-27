use anchor_lang::prelude::*;

pub const NODE_PDA_SEED: &[u8] = b"node_pda_seed";

#[account]
pub struct TreeNode {
    pub bump: u8,
    pub parent_mint: Option<Pubkey>,
    pub children_mint: Pubkey,
    pub owner: Pubkey,
}

impl TreeNode {
    pub fn space() -> usize {
        8 + 1 + (1 + 32) + 32 + 32
    }
}
