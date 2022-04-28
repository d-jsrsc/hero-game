import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useEffect } from 'react';
import log from 'loglevel';
import { useContract } from '../contract';
import { PublicKey } from '@solana/web3.js';

const logger = log.getLogger('Market');

export default function Market() {
  const wallet = useWallet();
  const contract = useContract();

  useEffect(() => {
    if (!wallet.publicKey) return;
    contract.instance
      .getHerosByOwner(wallet.publicKey)
      .then((data) => console.log(data))
      .catch(console.error);
  }, [wallet, contract]);

  const newTree = useCallback(async () => {
    await contract.instance.mintHero(wallet, 'rewen', 'lol', 'hero://rewen-lol');
    logger.debug('newTree success');
  }, [contract, wallet]);

  const transferHero = useCallback(async () => {
    if (!wallet.publicKey) return;
    await contract.instance.transferHero(
      wallet,
      new PublicKey('7FCvbozsCg5LY3b4Awj1Kq6W5viD7C67g9draD7viNCG'),
      new PublicKey('3112ASdPyfQFAvoyatxRdUrhe6MwN3TrWzxiBia6UdqA')
    );
  }, [contract, wallet]);

  return (
    <div>
      market
      <button onClick={newTree}>newMint</button>
      <button onClick={transferHero}>transfer</button>
    </div>
  );
}
