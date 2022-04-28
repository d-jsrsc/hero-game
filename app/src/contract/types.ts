import { PublicKey } from "@solana/web3.js";

export type NFTDataItem = { address: PublicKey; mint: string };

export type HeroNode = {
  mint: string;
  pda: string;
  children: (HeroNode | null)[];
  root: null | {
    name: string;
    owner: string;
  };
};
