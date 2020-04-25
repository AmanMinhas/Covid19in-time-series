import React, { useState, useEffect } from 'react';
import PlotLineChart from '../../components/PlotLineChart';

const useFetch = (path: string) => {
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

const Home = () => {
  const path: string = 'https://api.rootnet.in/covid19-in/stats/history';
  const [loadingStatesData, errorStatesData, statesData] = useFetch(path);
  const className = 'p-Home';

  const renderPlotLineChart = () => {
    if (loadingStatesData) return 'Loading...';
    if (errorStatesData) return <p>{errorStatesData}</p>;
    return <PlotLineChart statesData={statesData} />;
  }

  return (
    <div className={className}>
      <p>Home</p>
      {renderPlotLineChart()}
    </div>
  );
}

export default Home;