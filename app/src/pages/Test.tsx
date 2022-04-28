import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { web3 } from "@project-serum/anchor";
import { useCallback, useEffect, useState } from "react";
import log from "loglevel";
import {
  PublicKey,
  Connection,
  AccountInfo,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { getAccount } from "@solana/spl-token";

import { useContract } from "../contract";
import useTest from "../hooks/useTest";

const logger = log.getLogger("Test");

export default function Test() {
  const contract = useContract();
  const wallet = useWallet();
  const { connection } = useConnection();
  const { data, setData } = useTest();

  return (
    <div>
      <button
        onClick={() => {
          setData(Math.random() + "");
        }}
      >
        data: {`${data}`}
      </button>
    </div>
  );
}
