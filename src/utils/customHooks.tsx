import { useEffect, useState, useRef } from 'react';

export const useFetch = (path: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<null | any>(null);

  const fetchData = async () => {
    try {
      const path = 'https://api.rootnet.in/covid19-in/stats/history';
      const res = await fetch(path);
      console.log('res ', res);
      const data = await res.json();
      console.log('data ', data);
      setData(data);
      setLoading(false);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  return [loading, error, data];
}

export const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
