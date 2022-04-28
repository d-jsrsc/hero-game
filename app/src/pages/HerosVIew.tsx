import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Dialog } from '@reach/dialog';
import log from 'loglevel';

import { Tree, Node as TreeNode } from '../components/tree';
import { useContract, HeroNode } from '../contract';

const tree: TreeNode = {
  children: [
    {
      name: 'p1',
      children: [
        {
          name: 'pp1',
          children: [
            {
              name: 'ppp1-0',
              children: []
            },
            {
              name: 'ppp1-1',
              children: []
            },
            {
              name: 'ppp1-2',
              children: [
                {
                  name: 'pppp1-2-0',
                  children: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'p2',
      children: [{ name: 'pp2', children: [] }]
    }
  ],
  name: 'root'
};

export function HerosView() {
  const { rootkey } = useParams<'rootkey'>();
  useHeroTree(rootkey);

  return (
    <div>
      <h1>{rootkey}</h1>
      <img width={400} height={400} src={'image.src'} alt="" />
    </div>
  );
}

export function HerosModal() {
  const navigate = useNavigate();
  const { rootkey } = useParams<'rootkey'>();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const heroTree = useHeroTree(rootkey);
  log.info('heroTree', heroTree);

  function onDismiss() {
    navigate(-1);
  }

  return (
    <Dialog aria-labelledby="label" onDismiss={onDismiss} initialFocusRef={buttonRef}>
      <div
        style={{
          display: 'grid',
          justifyContent: 'center',
          padding: '8px 8px'
        }}></div>
      <Tree name="heros" data={tree} />
    </Dialog>
  );
}

function useHeroTree(rootKey: string | undefined) {
  const { instance: contract } = useContract();

  const [tree, setTree] = useState<HeroNode | null>(null);
  useEffect(() => {
    if (!rootKey) return;
    let alive = true;
    log.debug('loadHeroTree');
    // contract
    //   .loadHeroTree(rootKey)
    //   .then((data) => {
    //     alive && setTree(data);
    //   })
    //   .catch(log.error);
    return () => {
      alive = false;
    };
  }, [contract, rootKey]);

  return tree;
}
