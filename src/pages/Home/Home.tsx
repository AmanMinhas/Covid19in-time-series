import React, { useState, useEffect, useMemo, useContext, Suspense, lazy } from 'react';
import { useFetch, usePrevious } from '../../utils/customHooks';
import { GlobalContext } from '../../context/Global';
import Box from '../../components/Box';
import GenericLoader from '../../components/GenericLoader';
import Scroll from 'react-scroll';
import SelectRegion from '../../components/SelectRegion';
import Sources from '../../components/Sources';
import { timeSeriesApiPath } from '../../utils/sources';
import './Home.scss';
import { WebpIsSupported } from '../../utils/helpers';

const Dashboard = lazy(() => import('../../components/Dashboard'));
const PlotLineChart = lazy(() => import('../../components/PlotLineChart'));
const TopCases = lazy(() => import('../../components/TopCases'));

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
  const [covidCurveImgSrc, setCovidCurveImgSrc] = useState('');

  const { lastRefreshed } = stats || {};

  const className = 'p-Home';

  const { latestSummaryData } = useMemo(() => getLastDayData(stats), [stats]);

  const renderPlotLineChart = () => {
    if (!selectedRegionsMetadata.length) return null;
    if (loadingStatesData) return <GenericLoader />;
    if (errorStatesData) return <p>{errorStatesData}</p>;

    return (
      <Suspense fallback={<GenericLoader />}>
        <PlotLineChart stats={stats} selectedStates={selectedRegionsMetadata} />
      </Suspense>
    );
  };

  useEffect(() => {
    if ((prevSelectedRegionsCount || 0) < selectedRegionsMetadata.length) {
      Scroll.scroller.scrollTo(`${className}__line-chart-box`, {
        smooth: true,
      });
    }
  }, [prevSelectedRegionsCount, selectedRegionsMetadata]);

  useEffect(() => {
    (async () => {
      if (await WebpIsSupported()) {
        setCovidCurveImgSrc('/images/covid-19-curve-reference.webp');
      } else {
        setCovidCurveImgSrc('/images/covid-19-curve-reference.jpg');
      }
    })();
  }, []);

  return (
    <div className={className}>
      {loadingStatesData ? <GenericLoader /> : null}
      {latestSummaryData && lastRefreshed && (
        <Suspense fallback={<GenericLoader />}>
          <Dashboard summary={latestSummaryData} lastRefreshed={lastRefreshed} />
        </Suspense>
      )}
      {stats && (
        <Suspense fallback={<GenericLoader />}>
          <div className={`${className}__top-cases-container`}>
            <Box>
              <TopCases type="active-cases" count={10} stats={stats} />
            </Box>
          </div>
        </Suspense>
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
        <div className={`${className}__covid-curve-img-container`}>
          {covidCurveImgSrc ? (
            <img src={covidCurveImgSrc} loading="lazy" alt="COVID-19 Curve Reference" width="100%" />
          ) : null}
        </div>
      </Box>
      <Box>
        <Sources />
      </Box>
    </div>
  );
};

export default Home;
