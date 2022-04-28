import { useState } from 'react';

export default function useTest() {
  console.log('useTest function', Date.now());
  const [data, setData] = useState('');

  return { data, setData };
}
