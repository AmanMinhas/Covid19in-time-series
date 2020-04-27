import React, { useState, useEffect, useMemo } from 'react';
import PlotLineChart from '../../components/PlotLineChart';
import TopFive from '../../components/TopFive';
import { Multiselect } from 'multiselect-react-dropdown';
import { getUniqueColor } from '../../utils/color';
import './Home.scss';

export interface IRegion {
  loc: string;
  totalConfirmed: number;
  discharged: number;
  deaths: number;
}

interface IDaySummary {
  total: number;
  discharged: number;
  deaths: number;
}

export interface IDayData {
  day: string;
  summary: IDaySummary;
  regional: IRegion[];
}

export interface IStats {
  success: boolean;
  data: IDayData[];
}

export interface ISelectedState {
  name: string;
  dataKey: string;
  color: string;
}

const getStateOptions = (statesData: IStats) => {
  if (!statesData ||
    !statesData.success ||
    !Array.isArray(statesData.data)
  ) return [];

  const { data } = statesData;

  const lastDayData = data[data.length - 1];

  const states = lastDayData
    .regional
    .map((region: IRegion) => region.loc)
    .sort((a: string, b: string) => a.localeCompare(b))

  return [
    'India',
    ...states
  ];
}

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
  const [selectedStates, setSelectedStates] = useState<ISelectedState[]>([]);
  const className = 'p-Home';

  const stateOptions = useMemo(() => getStateOptions(statesData), [statesData]);

  const handleAddState = (_: any, state: string) => {
    const colorsInUse = selectedStates.map((state: ISelectedState) => state.color);

    const newState = {
      name: state,
      dataKey: state,
      color: getUniqueColor(colorsInUse)
    }

    setSelectedStates([
      ...selectedStates,
      newState
    ])
  }

  const handleRemoveState = (_: any, state: string) => {
    setSelectedStates(
      selectedStates.filter((selectedState: ISelectedState) => {
        return selectedState.name !== state
      })
    );
  }

  const renderStateSelectionDropdown = () => {
    return (
      <div className={`${className}__multiselect-container`}>
        <Multiselect
          options={stateOptions}
          isObject={false}
          closeOnSelect={true}
          avoidHighlightFirstOption={true}
          placeholder='Select State / UT'
          onSelect={handleAddState}
          onRemove={handleRemoveState}
        />
      </div>
    )
  }

  const renderPlotLineChart = () => {
    if (!selectedStates.length) return null;
    if (loadingStatesData) return 'Loading...';
    if (errorStatesData) return <p>{errorStatesData}</p>;
    return <PlotLineChart
      statesData={statesData}
      selectedStates={selectedStates}
    />;
  }

  return (
    <div className={className}>
      {renderStateSelectionDropdown()}
      {renderPlotLineChart()}
      {statesData && <TopFive stats={statesData} />}
    </div>
  );
}

export default Home;