import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";

import {
  TOKEN_PROGRAM_ID,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAccount,
  getMint,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  PROGRAM_ID as METADATA_PROGRAM_ID,
  Metadata,
} from "@metaplex-foundation/mpl-token-metadata";

// import { Prog } from '@metaplex-foundation/js-next'
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";

import { Sol998 } from "../target/types/sol998";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { createAccount } from "@solana/spl-token";

type User = {
  key: anchor.web3.Keypair;
  wallet: anchor.Wallet;
  provider: anchor.Provider;
};

console.log("METADATA_PROGRAM_ID", METADATA_PROGRAM_ID.toString());

describe("sol998", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Sol998 as Program<Sol998>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });

  it("mint hero", async () => {
    const owner = await createUser();
    // const { mint, mta } = await mintHero(owner);
    const name = "test"; // limit 32
    const symbol = "testSymbol"; // limit 10
    const uri = "hero://body"; // limit 200

    const [mint, mintBump] = await PublicKey.findProgramAddress(
      [
        Buffer.from("hero_mint_seed"),
        program.programId.toBuffer(),
        Buffer.from(name),
        Buffer.from(symbol),
      ],
      program.programId
    );

    const mintResult = await program.methods
      .mintHeroPre(name, symbol, uri)
      .accounts({
        heroMint: mint,
        user: owner.key.publicKey,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([owner.key])
      .rpc();
    console.log("mintResult", mintResult);

    const mintTokenAccount = await getAssociatedTokenAddress(
      mint,
      owner.key.publicKey
    );
    console.log("mintTokenAccount", mintTokenAccount.toString());

    const [metadataAccount, metadataBump] = await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      METADATA_PROGRAM_ID
    );

    const r = await program.methods
      .mintHero(name, symbol, uri)
      .accounts({
        heroMetadataAccount: metadataAccount,
        heroMint: mint,
        heroMintTokenAccount: mintTokenAccount,
        user: owner.key.publicKey,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        mplProgram: METADATA_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([owner.key])
      .rpc();
    console.log("mintHero result", r);

    // Metadata.fromAccountInfo;
    const heroMetadata = await Metadata.fromAccountAddress(
      provider.connection,
      metadataAccount
    );
    console.log(heroMetadata);
    // const accountInfo = await provider.connection.getParsedAccountInfo(
    //   mintTokenAccount
    // );
    // console.log({
    //   accountInfo: (accountInfo.value.data as anchor.web3.ParsedAccountData)
    //     .parsed,
    // });
    const mintInfo = await getMint(provider.connection, mint);
    console.log({ mintInfo });
    // const info = await getAccount(provider.connection, mintTokenAccount);
    // console.log({ info });
  });

  async function createUser(airdropBalance?: number): Promise<{
    key: anchor.web3.Keypair;
    wallet: anchor.Wallet;
    provider: anchor.Provider;
  }> {
    airdropBalance = airdropBalance ?? 10 * LAMPORTS_PER_SOL;

    let user = anchor.web3.Keypair.generate();

    let sig = await provider.connection.requestAirdrop(
      user.publicKey,
      airdropBalance
    );

    const result = await provider.connection.confirmTransaction(
      sig,
      "processed"
    );

    // const balance = await getAccountBalance(user.publicKey);

    let wallet = new anchor.Wallet(user);
    let userProvider = new anchor.AnchorProvider(
      provider.connection,
      wallet,
      provider.opts
    );

    return {
      key: user,
      wallet,
      provider: userProvider,
    };
  }

  async function mintHero(user: User) {
    const mint = await createMint(
      anchor.getProvider().connection,
      user.key,
      user.key.publicKey,
      user.key.publicKey,
      0
    );

    const mintTokenAccount = await getOrCreateAssociatedTokenAccount(
      anchor.getProvider().connection,
      user.key,
      mint,
      user.key.publicKey
    );

    await mintTo(
      anchor.getProvider().connection,
      user.key,
      mint,
      mintTokenAccount.address,
      user.key,
      1,
      []
    );
    return { mint, mta: mintTokenAccount };
  }
});

// connection
// .getTokenAccountsByOwner(selectedAccount.publicKey, {
//   programId: TOKEN_PROGRAM_ID
// })
// .then((data) => {
//   console.log('getTokenAccountsByOwner', data);
//   return data.value
//     .map((dataAccount) => {
//       const { data } = dataAccount.account;
//       // console.log(
//       //   data.length === AccountLayout.span,
//       //   dataAccount.account.owner.equals(TOKEN_PROGRAM_ID)
//       // );
//       return AccountLayout.decode(data);
//     })
//     .filter((item) => item.amount > 0);
// })
// .then((data) => {
//   return Promise.all(
//     data.map(async (rawAccount) => {
//       // console.log(
//       //   rawAccount.mint.toString(),
//       //   rawAccount.owner.toString(),
//       //   Number(rawAccount.amount),
//       //   rawAccount.state
//       // );
//       const [metadataPDA, _metadataBump] = await getMetadataPDA(rawAccount.mint);
//       return metadataPDA;
//     })
//   );
// })
// .then((data) => {
//   data.forEach((item) => {
//     console.log('metadataPDA', item.toString());
//   });
//   return connection.getMultipleAccountsInfo(data);
// })
// .then((metadataAccounts) => {
//   const validData = metadataAccounts
//     .filter((item) => item != null)
//     .flatMap((item) => (item ? [item] : []))
//     .map((item) => {
//       const [metadata, _metadataNumber] = Metadata.fromAccountInfo(item);
//       return metadata;
//     });
//   console.log(validData);
// })
// .catch(console.error);

// export async function getMetadataPDA(mint: PublicKey) {
//   const key = await PublicKey.findProgramAddress(
//     [Buffer.from('metadata'), MetadataProgramId.toBuffer(), mint.toBuffer()],
//     MetadataProgramId
//   );
//   return key;
// }
