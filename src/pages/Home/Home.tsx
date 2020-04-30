import React, { useState, useEffect, useMemo } from 'react';
import PlotLineChart from '../../components/PlotLineChart';
import { Multiselect } from 'multiselect-react-dropdown';
import { getUniqueColor } from '../../utils/color';
import Dashboard from '../../components/Dashboard';
import Box from '../../components/Box';
import TopCases from '../../components/TopCases';
import './Home.scss';

export interface IRegion {
  loc: string;
  totalConfirmed: number;
  discharged: number;
  deaths: number;
}

export interface IDaySummary {
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

export interface ISelectedStateBase {
  name: string;
  dataKey: string;
  color: string;
}

export type ISelectedState = ISelectedStateBase & IRegion;

const getLastDayData = (statesData: IStats) => {
  const initial = {
    latestSummaryData: null,
    latestRegionalData: [],
    regionOptions: []
  };

  if (!statesData ||
    !statesData.success ||
    !Array.isArray(statesData.data)
  ) return initial;

  const { data } = statesData;

  const lastDayData = data[data.length - 1];

  const regionOptions = lastDayData
    .regional
    .map((region: IRegion) => region.loc)
    .sort((a: string, b: string) => a.localeCompare(b))

  return {
    latestSummaryData: lastDayData.summary,
    latestRegionalData: lastDayData.regional,
    regionOptions
  };
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
  const [loadingStatesData, errorStatesData, stats] = useFetch(path);
  const [selectedStates, setSelectedStates] = useState<ISelectedState[]>([]);
  const className = 'p-Home';

  const { latestSummaryData, latestRegionalData, regionOptions } = useMemo(() => getLastDayData(stats), [stats]);
  const selectedRegionsStr = useMemo(() => {
    return selectedStates.map((state: ISelectedState) => state.name);
  }, [selectedStates]);

  const handleAddRegion = (_: any, regionName: string) => {
    const colorsInUse = selectedStates.map((state: ISelectedState) => state.color);
    const regionData = latestRegionalData.find((region: IRegion) => region.loc === regionName);

    if (regionData) {
      const newRegion = {
        name: regionName,
        dataKey: regionName,
        color: getUniqueColor(colorsInUse),
        ...regionData
      }

      setSelectedStates([
        ...selectedStates,
        newRegion
      ])
    }
  }

  const handleRemoveRegion = (_: any, state: string) => {
    setSelectedStates(
      selectedStates.filter((selectedState: ISelectedState) => {
        return selectedState.name !== state
      })
    );
  }

  const renderStateSelectionDropdown = () => {
    // const selectedValues = selectedStates.map((state: ISelectedState) => state.name);
    // console.log('selectedValues ', selectedValues);

    return (
      <div className={`${className}__multiselect-container`}>
        <Multiselect
          options={regionOptions}
          selectedValues={selectedRegionsStr}
          isObject={false}
          closeOnSelect={true}
          avoidHighlightFirstOption={true}
          placeholder='Select State / UT'
          onSelect={handleAddRegion}
          onRemove={handleRemoveRegion}
        />
      </div>
    )
  }

  const renderPlotLineChart = () => {
    if (!selectedStates.length) return null;
    if (loadingStatesData) return 'Loading...';
    if (errorStatesData) return <p>{errorStatesData}</p>;
    return <PlotLineChart
      stats={stats}
      selectedStates={selectedStates}
    />;
  }

  return (
    <div className={className}>
      {latestSummaryData && (
        <Dashboard summary={latestSummaryData} />
      )}
      {stats && (
        <Box>
          <TopCases
            type='active-cases'
            count={10}
            stats={stats}
          />
        </Box>
      )}
      <Box>
        {renderStateSelectionDropdown()}
        {renderPlotLineChart()}
      </Box>
    </div>
  );
}

export default Home;