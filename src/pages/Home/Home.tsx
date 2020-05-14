import React, { useEffect, useMemo, useContext } from 'react';
import { useFetch, usePrevious } from '../../utils/customHooks';
import { GlobalContext } from '../../context/Global';
import Box from '../../components/Box';
import Dashboard from '../../components/Dashboard';
import PlotLineChart from '../../components/PlotLineChart';
import TopCases from '../../components/TopCases';
import Scroll from 'react-scroll';
import SelectRegion from '../../components/SelectRegion';
import Sources from '../../components/Sources';
import { timeSeriesApiPath } from '../../utils/sources';
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
  lastRefreshed: string;
}

export interface ISelectedStateBase {
  name: string;
  dataKey: string;
  color: string;
}

export type ISelectedState = ISelectedStateBase & IRegion;

const getLastDayData = (stats: IStats) => {
  const initial = {
    latestSummaryData: null,
  };

  if (!stats || !stats.success || !Array.isArray(stats.data) || !stats.data.length) return initial;

  const { data } = stats;

  const lastDayData = data[data.length - 1];

  return {
    latestSummaryData: lastDayData.summary,
  };
};

const Home = () => {
  const [loadingStatesData, errorStatesData, stats] = useFetch(timeSeriesApiPath.value);
  const { selectedRegionsMetadata } = useContext(GlobalContext);
  const prevSelectedRegionsCount = usePrevious(selectedRegionsMetadata.length);

  const { lastRefreshed } = stats || {};

  const className = 'p-Home';

  const { latestSummaryData } = useMemo(() => getLastDayData(stats), [stats]);

  const renderPlotLineChart = () => {
    if (!selectedRegionsMetadata.length) return null;
    if (loadingStatesData) return 'Loading...';
    if (errorStatesData) return <p>{errorStatesData}</p>;

    return <PlotLineChart stats={stats} selectedStates={selectedRegionsMetadata} />;
  };

  useEffect(() => {
    if ((prevSelectedRegionsCount || 0) < selectedRegionsMetadata.length) {
      Scroll.scroller.scrollTo(`${className}__line-chart-box`, {
        smooth: true,
      });
    }
  }, [prevSelectedRegionsCount, selectedRegionsMetadata]);

  return (
    <div className={className}>
      {latestSummaryData && lastRefreshed && <Dashboard summary={latestSummaryData} lastRefreshed={lastRefreshed} />}
      {stats && (
        <Box>
          <TopCases type="active-cases" count={10} stats={stats} />
        </Box>
      )}
      <Scroll.Element name={`${className}__line-chart-box`}>
        <Box>
          <div className={`${className}__line-chart-box-container`}>
            <div className={`${className}__line-chart-box-container__select-region`}>
              <SelectRegion />
            </div>
            {renderPlotLineChart()}
          </div>
        </Box>
      </Scroll.Element>
      <Box>
        <img src="/images/covid-19-curve-reference.jpg" alt="COVID-19 Curve Reference" width="100%" />
      </Box>
      <Box>
        <Sources />
      </Box>
    </div>
  );
};

export default Home;
