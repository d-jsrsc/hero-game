import * as anchor from '@project-serum/anchor';
import { PublicKey, Connection, SystemProgram, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider } from '@project-serum/anchor';
import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';
// import log from 'loglevel';
import {
  PROGRAM_ID as METADATA_PROGRAM_ID,
  Metadata
} from '@metaplex-foundation/mpl-token-metadata';
import { Metaplex } from '@metaplex-foundation/js-next';

import { NFTDataItem } from './types';
import { Sol998 } from './sol998';

import idlJSON from './sol998.json';
import { ASSOCIATED_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';

// const logger = log.getLogger('ContractInstance');

const PROGRAM_ID = new PublicKey(idlJSON.metadata.address);

type ParsedTokenAccountInfo = {
  isNative: boolean;
  mint: string; // '5gdhnvfUeWR1FgCktTc3ezq6FAY4g9hTTSb9bssMbNX3';
  owner: string; //'3112ASdPyfQFAvoyatxRdUrhe6MwN3TrWzxiBia6UdqA';
  state: string; //'initialized';
  tokenAmount: {
    amount: string; //'0';
    decimals: number; //0;
    uiAmount: number; //0;
    uiAmountString: string; //'0';
  };
};

export class Contract {
  private static _instance: Contract = new Contract();

  // private _wallet: WalletContextState | null = null;
  private _connection: Connection | null = null;
  private _program: Program<Sol998> | null = null;
  private _metaplex: Metaplex | null = null;

  constructor() {
    if (Contract._instance) {
      throw new Error(
        'Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.'
      );
    }
    Contract._instance = this;
  }

  public static getInstance(): Contract {
    return Contract._instance;
  }

  private initProgram(connection: Connection) {
    // logger.info("Contract initProgram");
    const provider = new AnchorProvider(
      connection,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).solana,
      AnchorProvider.defaultOptions()
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const program = new Program(idlJSON as any, PROGRAM_ID, provider) as Program<Sol998>;
    this._program = program;
    // this._metaplex = new MetaplexNext.Metaplex(connection);
  }

  // public setWallet(wallet: WalletContextState) {
  //   this._wallet = wallet;
  // }

  public setConnection(conn: Connection) {
    this._connection = conn;
    this.initProgram(conn);
  }

  /**
   * mintHero
   */
  public async mintHero(wallet: WalletContextState, name: string, symbol: string, uri: string) {
    if (!this._connection || !this._program || !wallet.publicKey) {
      throw new Error('!this._connection ||!this._program || !wallet.publicKey');
    }
    const connection = this._connection;
    const program = this._program;
    const [mint] = await PublicKey.findProgramAddress(
      [
        Buffer.from('hero_mint_seed'),
        program.programId.toBuffer(),
        Buffer.from(name),
        Buffer.from(symbol)
      ],
      program.programId
    );

    const mintInstruction = await program.methods
      .mintHeroPre(name, symbol, uri)
      .accounts({
        heroMint: mint,

        user: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .instruction();

    // const [mintTokenAccount] = await PublicKey.findProgramAddress([], program.programId);
    const mintTokenAccount = await getAssociatedTokenAddress(mint, wallet.publicKey);

    const [metadataAccount] = await PublicKey.findProgramAddress(
      [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      METADATA_PROGRAM_ID
    );
    const transaction = await program.methods
      .mintHero(name, symbol, uri)
      .accounts({
        heroMetadataAccount: metadataAccount,
        heroMint: mint,
        heroMintTokenAccount: mintTokenAccount,
        user: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        mplProgram: METADATA_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID
      })
      .instruction();

    const tx = new Transaction().add(...[mintInstruction, transaction]);

    const signature = await wallet.sendTransaction(tx, connection);
    const result = await connection.confirmTransaction(signature, 'processed');
    console.log('mintHero', result);
  }

  /**
   * get
   */
  public async getHerosByOwner(owner: PublicKey) {
    if (!this._connection) {
      throw new Error('!this._connection');
    }
    const connection = this._connection;
    // const data = await connection.getTokenAccountsByOwner(owner, {
    //   programId: TOKEN_PROGRAM_ID
    // });
    const data = await connection.getParsedTokenAccountsByOwner(owner, {
      programId: TOKEN_PROGRAM_ID
    });
    const metadataInfo = await Promise.all(
      data.value
        .map((dataAccount) => {
          const { data } = dataAccount.account;
          // console.log(dataAccount.pubkey.toString());
          return data.parsed.info;
          // return AccountLayout.decode(data);
        })
        .filter((item: ParsedTokenAccountInfo) => item.tokenAmount.uiAmount > 0)
        .map(async (item: ParsedTokenAccountInfo) => {
          const [metadataPDA] = await getMetadataPDA(new PublicKey(item.mint));
          // metadataPDAs.push(metadataPDA);
          return {
            mint: item.mint,
            parsedTokenAccountInfo: item,
            metadataPDA
          };
        })
    );

    const metadataAccountInfo = await connection.getMultipleAccountsInfo(
      metadataInfo.map((item) => item.metadataPDA)
    );
    const result = metadataAccountInfo
      .map((item, index) => {
        if (!item) return null;
        const [metadata] = Metadata.fromAccountInfo(item);
        if (!metadata.data.uri.startsWith('hero')) return null;
        return {
          metadataData: metadata.data,
          ...metadataInfo[index]
        };
      })
      .filter((item) => item != null)
      .flatMap((item) => (item && [item]) || []);
    // console.log(result);
    return result;
  }

  /**
   * transferHero
   */
  public async transferHero(
    wallet: WalletContextState,
    heroMint: PublicKey,
    receiver: PublicKey,
    amount = 1
  ) {
    if (!this._connection || !wallet.publicKey) {
      throw new Error('transferHero !this._connection');
    }
    const connection = this._connection;
    // await connection.getTokenLargestAccounts(heroMint);
    const ataSource = await getAssociatedTokenAddress(heroMint, wallet.publicKey);
    console.log(ataSource.toString());
    const ataAccountInfo = await connection.getAccountInfo(ataSource);
    if (!ataAccountInfo) throw new Error('!ataAccountInfo');

    const ataDestination = await getAssociatedTokenAddress(
      heroMint, // mint
      receiver // owner
    );
    const ataDesAccountInfo = await connection.getAccountInfo(ataDestination);

    const transaction = new Transaction();
    if (!ataDesAccountInfo) {
      const ataInstruction = createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        ataDestination,
        receiver,
        heroMint
      );
      transaction.add(ataInstruction);
    }
    transaction.add(
      createTransferCheckedInstruction(
        ataSource,
        heroMint,
        ataDestination,
        wallet.publicKey,
        amount,
        0
      )
    );

    const signature = await wallet.sendTransaction(transaction, connection);
    const result = await connection.confirmTransaction(signature, 'processed');
    console.log('transferHero', result);
  }

  /**
   * 获取用户有效的 NFT
   * @param owner
   * @returns
   */
  public async getValidNFTokensWithOwner(owner: PublicKey): Promise<NFTDataItem[]> {
    if (!this._connection) {
      return [];
    }
    const tokens = await this._connection.getParsedTokenAccountsByOwner(owner, {
      programId: TOKEN_PROGRAM_ID
    });

    // initial filter - only tokens with 0 decimals & of which 1 is present in the wallet
    const filteredToken = tokens.value
      .filter((t) => {
        const amount = t.account.data.parsed.info.tokenAmount;
        return amount.decimals === 0 && amount.uiAmount === 1;
      })
      .map((t) => ({
        address: t.pubkey,
        mint: t.account.data.parsed.info.mint
      }));
    return filteredToken;
  }

  // public async loadMyHeros(walletPubkey: PublicKey): Promise<
  //   | null
  //   | {
  //       nft: Nft;
  //       name: string;
  //       key: string;
  //     }[]
  // > {
  //   if (
  //     !this._connection ||
  //     !this._program ||
  //     !this._metaplex ||
  //     !walletPubkey
  //   ) {
  //     return null;
  //   }
  //   logger.info("loadMyHeros with walletPubkey: ", walletPubkey.toString());
  //   const heroRoots = await this._program!.account.treeRootNode.all([
  //     {
  //       memcmp: {
  //         offset: 8 + 1 + 32,
  //         bytes: walletPubkey.toBase58(),
  //       },
  //     },
  //   ]);
  //   const nftData = heroRoots.map(async (hero) => {
  //     const nftMint: PublicKey = hero.account.childrenMint as PublicKey;
  //     const nft = await this._metaplex!.nfts().findNftByMint(nftMint);
  //     return { nft, name: hero.account.name, key: hero.publicKey.toString() };
  //   });
  //   const nfts = await Promise.all(nftData);
  //   logger.info("loadMyHeros done: ", nfts);
  //   return nfts;
  // }

  // public async loadHeroTree(rootkey: string) {
  //   if (!this._connection || !this._program || !this._metaplex) {
  //     return null;
  //   }
  //   const program = this._program;
  //   const rootKey = new PublicKey(rootkey);
  //   const heroRoot = await program.account.treeRootNode.fetch(rootKey);

  //   const mint = heroRoot.childrenMint as PublicKey;

  //   const tree = await loadNode(mint);

  //   const heroTree: HeroNode = {
  //     mint: tree.mint,
  //     pda: tree.pda,
  //     children: tree.children,
  //     root: {
  //       name: heroRoot.name,
  //       owner: heroRoot.owner.toString(),
  //     },
  //   };

  //   return heroTree;

  //   async function loadNode(mint: PublicKey): Promise<HeroNode> {
  //     const [nodePDA, nodeBump] = await PublicKey.findProgramAddress(
  //       [
  //         Buffer.from(NODE_SEED_STR),
  //         (heroRoot.childrenMint as PublicKey).toBytes(),
  //       ],
  //       program.programId
  //     );

  //     const curr: HeroNode = {
  //       mint: mint.toString(),
  //       pda: nodePDA.toString(),
  //       children: [],
  //       root: null,
  //     };

  //     const node = await program.account.treeNode.fetch(nodePDA);
  //     const nodes = (node.childrenMint as Array<null | PublicKey>).map(
  //       async (item) => {
  //         if (!item) return null;
  //         return await loadNode(item);
  //       }
  //     );
  //     await sleep(0.5);
  //     const childrenNodes = await Promise.all(nodes);
  //     curr.children = childrenNodes;
  //     return curr;
  //   }
  // }

  // /**
  //  * newTree
  //  */
  // public async newTree(wallet: WalletContextState) {
  //   const mint = new PublicKey("HvxwQA3tuDJPr3dVcJy92imAnHkU8j7WGc8RerBqUCR7");
  //   const [rootPDA, rootBump] = await anchor.web3.PublicKey.findProgramAddress(
  //     [Buffer.from(ROOT_SEED_STR), mint.toBytes()],
  //     this._program!.programId
  //   );
  //   const [nodePDA, nodeBump] = await anchor.web3.PublicKey.findProgramAddress(
  //     [Buffer.from(NODE_SEED_STR), mint.toBytes()],
  //     this._program!.programId
  //   );

  //   console.log({ rootPDA: rootPDA.toString() });
  //   const mintTokenAccounts = await this._connection!.getTokenLargestAccounts(
  //     mint
  //   );
  //   const mintTokenAccountAddr = mintTokenAccounts.value[0].address;
  //   console.log("mintTokenAccountAddr", mintTokenAccountAddr.toString());
  //   const mta = await getAccount(this._connection!, mintTokenAccountAddr);
  //   console.log("mta", mta?.owner.toString());

  //   const tx = await this._program!.methods.newTree(rootBump, nodeBump)
  //     .accounts({
  //       rootNode: rootPDA,
  //       node: nodePDA,
  //       mint,
  //       mintTokenAccount: mintTokenAccountAddr,
  //       user: wallet.publicKey!,
  //       systemProgram: SystemProgram.programId,
  //       rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //     })
  //     .transaction();

  //   const signature = await wallet.sendTransaction(tx, this._connection!);
  //   const result = await this._connection!.confirmTransaction(
  //     signature,
  //     "processed"
  //   );
  //   console.log("newTree", result);
  // }
}

// async function sleep(s: number) {
//   await new Promise((resolve, reject) => {
//     setTimeout(resolve, s * 1000);
//   });
// }

async function getMetadataPDA(mint: PublicKey) {
  const key = await PublicKey.findProgramAddress(
    [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    METADATA_PROGRAM_ID
  );
  return key;
}

// async function findAssociatedTokenAddress(
//   walletAddress: PublicKey,
//   tokenMintAddress: PublicKey
// ): Promise<PublicKey> {
//   return (
//     await PublicKey.findProgramAddress(
//       [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()],
//       SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
//     )
//   )[0];
// }
