use anchor_lang::prelude::*;

use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{
    self, InitializeAccount, InitializeMint, Mint, MintTo, SetAuthority, Token, TokenAccount,
};
use mpl_token_metadata::instruction::create_metadata_accounts_v2;
// use mpl_token_metadata::instruction::{
//     create_master_edition_v3, create_metadata_accounts_v2,
//     mint_edition_from_master_edition_via_vault_proxy,
// };
// use mpl_token_metadata::processor::process_create_metadata_accounts_v2;
use solana_program::program::invoke;
use solana_program::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    sysvar,
};
// use spl_associated_token_account::ID;
use spl_token::instruction::AuthorityType;

use crate::ID as HeroID;

pub const HERO_MINT_SEED: &[u8] = b"hero_mint_seed";
// pub const HERO_MINT_TOKEN_ACCOUNT_SEED: &[u8] = b"hero_mint_token_account_seed";

#[derive(Clone)]
pub struct TokenMetadata;

impl anchor_lang::Id for TokenMetadata {
    fn id() -> Pubkey {
        mpl_token_metadata::ID
    }
}

#[derive(Accounts)]
#[instruction(name: String, symbol: String)]
pub struct HeroMintPre<'info> {
    #[account(
        init,
        payer = user,
        space = Mint::LEN,
        owner = token_program.key(),
        seeds = [HERO_MINT_SEED, HeroID.as_ref(), name_seed(&name), name_seed(&symbol)], bump,
    )]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub hero_mint: AccountInfo<'info>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct HeroMint<'info> {
 #[account(mut)]
    pub hero_mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = hero_mint,
        associated_token::authority = user,    
    )]
    pub hero_mint_token_account: Account<'info, TokenAccount>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub hero_metadata_account: AccountInfo<'info>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
    pub mpl_program: Program<'info, TokenMetadata>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn handler_pre(ctx: Context<HeroMintPre>, name: String, symbol: String, _uri: String) -> Result<()> {
    
    let cpi_accounts = InitializeMint {
        mint: ctx.accounts.hero_mint.to_account_info(),
        rent: ctx.accounts.rent.to_account_info(),
    };
    let mint_cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);

    token::initialize_mint(mint_cpi_ctx, 0, ctx.accounts.user.key, None)?;
    msg!("create mint account");
    
    Ok(())
}

pub fn handler(ctx: Context<HeroMint>, name: String, symbol: String, uri: String) -> Result<()> {

    // create spl token account
    // let cpi_accounts = InitializeAccount {
    //     account: ctx.accounts.hero_mint_token_account.to_account_info(),
    //     mint: ctx.accounts.hero_mint.to_account_info(),
    //     authority: ctx.accounts.user.to_account_info(),
    //     rent: ctx.accounts.rent.to_account_info(),
    // };
    // let account_cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
    

    // token::initialize_account(account_cpi_ctx)?;
    // msg!("create spl token account");

    // mint 1 nft
    let cpi_accounts = MintTo {
        mint: ctx.accounts.hero_mint.to_account_info(),
        to: ctx.accounts.hero_mint_token_account.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    let mint_to_cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
    
    token::mint_to(mint_to_cpi_ctx, 10)?;
    msg!("mint to account");

    // create metadata
    // invoke(
    //     &create_metadata_accounts_v2(
    //         mpl_token_metadata::ID,
    //         ctx.accounts.hero_metadata_account.key(),
    //         ctx.accounts.hero_mint.to_account_info().key(),
    //         ctx.accounts.user.to_account_info().key(),
    //         ctx.accounts.user.to_account_info().key(),
    //         ctx.accounts.user.to_account_info().key(),
    //         name,
    //         symbol,
    //         uri,
    //         None,
    //         0,
    //         true,
    //         false,
    //         None,
    //         None,
    //     ),
    //     &[
    //         ctx.accounts.hero_metadata_account.clone(),
    //         ctx.accounts.hero_mint.to_account_info(),
    //         ctx.accounts.user.to_account_info(),
    //         ctx.accounts.user.to_account_info(),
    //         ctx.accounts.user.to_account_info(),
    //         ctx.accounts.system_program.to_account_info(),
    //         ctx.accounts.rent.to_account_info(),
    //     ],
    // )?;


    // let hero_metadata_account = 
    // let update_authority = ctx.accounts.user.to_account_info().key();
    // invoke(
    //     &Instruction {
    //         program_id: HeroID,
    //         accounts: vec![
    //             AccountMeta::new(metadata_account, false),
    //             AccountMeta::new_readonly(mint, false),
    //             AccountMeta::new_readonly(mint_authority, true),
    //             AccountMeta::new(payer, true),
    //             AccountMeta::new_readonly(update_authority, update_authority_is_signer),
    //             AccountMeta::new_readonly(solana_program::system_program::id(), false),
    //             AccountMeta::new_readonly(sysvar::rent::id(), false),
    //         ],
    //         data: Vec::from("helloWorld"),
    //     },
    //     &[
    //         ctx.accounts.hero_metadata_account.clone(),
    //         ctx.accounts.hero_mint.to_account_info(),
    //         ctx.accounts.user.to_account_info(),
    //         ctx.accounts.user.to_account_info(),
    //         ctx.accounts.user.to_account_info(),
    //         ctx.accounts.system_program.to_account_info(),
    //         ctx.accounts.rent.to_account_info(),
    //     ],
    // )?;

    // mint disable
    let cpi_accounts = SetAuthority {
        account_or_mint: ctx.accounts.hero_mint.to_account_info(),
        current_authority: ctx.accounts.user.to_account_info(),
    };
    let ctx_auth = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
    token::set_authority(ctx_auth, AuthorityType::MintTokens, None)?;

    // token::set_authority(
    //     ctx.accounts.disable_mint_to_context(),
    //     AuthorityType::MintTokens,
    //     None,
    // )?;

    Ok(())
}

fn name_seed(name: &str) -> &[u8] {
    let b = name.as_bytes();
    if b.len() > 32 {
        &b[0..32]
    } else {
        b
    }
}

// impl<'info> HeroMint<'info> {
//     // fn initialize_mint_context(&self) -> CpiContext<'_, '_, '_, 'info, InitializeMint<'info>> {
//     //     let cpi_accounts = InitializeMint {
//     //         mint: self.hero_mint.clone(),
//     //         rent: self.rent.to_account_info(),
//     //     };
//     //     CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
//     // }

//     fn initialize_mint_to_context(&self) -> CpiContext<'_, '_, '_, 'info, MintTo<'info>> {
//         let cpi_accounts = MintTo {
//             mint: self.hero_mint.to_account_info(),
//             to: self.hero_mint_token_account.to_account_info(),
//             authority: self.user.to_account_info(),
//         };
//         CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
//     }

//     fn initialize_account_context(
//         &self,
//     ) -> CpiContext<'_, '_, '_, 'info, InitializeAccount<'info>> {
//         let cpi_accounts = InitializeAccount {
//             account: self.hero_mint_token_account.to_account_info(),
//             mint: self.hero_mint.to_account_info(),
//             authority: self.user.to_account_info(),
//             rent: self.rent.to_account_info(),
//         };
//         CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
//     }

//     fn disable_mint_to_context(&self) -> CpiContext<'_, '_, '_, 'info, SetAuthority<'info>> {
//         let cpi_accounts = SetAuthority {
//             account_or_mint: self.hero_mint.to_account_info(),
//             current_authority: self.user.to_account_info(),
//         };
//         CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
//     }
// }
