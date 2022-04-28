import { useWallet } from '@solana/wallet-adapter-react';
import log from 'loglevel';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

import { useContract } from '../contract';

const logger = log.getLogger('Page Heros');

type Heros = {
  rootkey: string;
  name: string;
  uri: string;
};

export default function HerosPage() {
  const location = useLocation();
  const contract = useContract();
  const wallet = useWallet();
  const { publicKey } = wallet;

  const [heros, _setHeros] = useState<Heros[]>([]);

  useEffect(() => {
    let _valid = true;
    if (!publicKey) return;
    // (async () => {
    //   const nfts = await contract.instance.loadMyHeros(publicKey);
    //   if (!valid || !nfts) return;
    //   const data = nfts.map(({ nft, name, key }) => ({
    //     name,
    //     rootkey: key,
    //     uri: nft.uri,
    //   }));
    //   setHeros(data);
    // })();
    return () => {
      _valid = false;
    };
  }, [contract, publicKey]);

  const newTree = useCallback(async () => {
    // await contract.instance.newTree(wallet);
    logger.debug('newTree success');
  }, [contract, wallet]);

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px'
        }}>
        {heros.map((hero) => (
          <Link
            key={hero.rootkey}
            to={`/heros/${hero.rootkey}`}
            state={{ backgroundLocation: location }}>
            <HeroCard {...hero} />
          </Link>
        ))}
      </div>
      <button onClick={newTree}>new</button>
    </div>
  );
}

function HeroCard({ uri, rootkey }: Heros) {
  const [data, setData] = useState({
    image: ''
  });

  useEffect(() => {
    let alive = true;
    axios.get(uri).then(({ data }) => {
      alive && setData(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <img
      width={200}
      height={200}
      style={{
        aspectRatio: '1 / 1',
        height: 'auto',
        borderRadius: '8px'
      }}
      src={data.image}
      alt={rootkey}
    />
  );
}
