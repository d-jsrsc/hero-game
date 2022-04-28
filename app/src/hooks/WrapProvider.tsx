import React, { createContext, useContext, useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter
} from '@solana/wallet-adapter-wallets';

// import { isProd } from '../utils';
import { useLocalStorageState } from './useLocalStorageState';

interface ContextData {
  network: string;
  setNetwork: (_arg0: WalletAdapterNetwork) => void;
}

export const contextDefaultValue: ContextData = {
  network: WalletAdapterNetwork.Devnet,
  setNetwork: (n: WalletAdapterNetwork) => {
    console.log(n);
  }
};

const WrapContext = createContext(contextDefaultValue);

type Props = {
  children: React.ReactNode;
};
export function WrapProvider({ children }: Props) {
  // const [network, setNetwork] = useState(
  //   isProd ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet
  // );

  const [network, setNetwork] = useLocalStorageState(
    'connectionNetwork',
    WalletAdapterNetwork.Devnet
  );

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network })
    ],
    [network]
  );

  return (
    <WrapContext.Provider
      value={{
        network,
        setNetwork: (n: WalletAdapterNetwork) => {
          setNetwork(n);
        }
      }}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider autoConnect wallets={wallets}>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </WrapContext.Provider>
  );
}

export function useWrapConfig() {
  const context = useContext(WrapContext);
  if (!context) {
    throw new Error('Missing connection context');
  }
  return { network: context.network, setNetwork: context.setNetwork };
}
