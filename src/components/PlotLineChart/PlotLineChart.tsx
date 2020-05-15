import React, { useState, useEffect } from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Legend, ResponsiveContainer } from 'recharts';
import { IStats, IDayData, IRegion } from '../../pages/Home/Home';
import './PlotLineChart.scss';
import { IRegionPlotMetaData } from '../../context/Global/Global';
import { useTranslation } from 'react-i18next';

interface PlotLineChartProps {
  stats: IStats;
  selectedStates: IRegionPlotMetaData[];
}

const PlotLineChart = (props: PlotLineChartProps) => {
  const { stats, selectedStates } = props;
  const [lineData, setLineData] = useState<any>([]); //eslint-disable-line
  const { t } = useTranslation();
  const className = 'c-PlotLineChart';

  useEffect(() => {
    if (stats) {
      const { data } = stats;

      const formattedLineData = data.map((dayData: IDayData) => {
        const { day, summary, regional } = dayData;
        const shortDay = day.replace('2020-', '').replace('-', '/');

        let includeCountryData = false;
        let statesData = {};
        selectedStates.forEach((state: IRegionPlotMetaData) => {
          if (state.name === 'India') {
            includeCountryData = true;
            return;
          }
          const details = regional.find((region: IRegion) => region.loc === state.name);
          if (details) {
            const { totalConfirmed, discharged, deaths } = details;
            statesData = {
              ...statesData,
              [state.dataKey]: totalConfirmed - discharged - deaths,
            };
          }
        });

        const countryData = includeCountryData
          ? {
              India: summary.total - summary.discharged,
            }
          : {};

        return {
          day: shortDay,
          ...countryData,
          ...statesData,
        };
      });

      setLineData(formattedLineData);
    }
  }, [stats, selectedStates]);

  if (!lineData.length) return null;

  return (
    <div className={className}>
      <p className={`${className}__title`}>{t('activeCasesTimeSeries')}</p>
      <ResponsiveContainer height={250}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis width={40} />
          <Tooltip />
          <Legend iconType="circle" wrapperStyle={{ bottom: 0, left: 15 }} />
          {selectedStates.map((stateData: IRegionPlotMetaData, key: number) => {
            const { dataKey, color } = stateData;
            return <Line key={key} type="monotone" dataKey={dataKey} stroke={color} dot={false} />;
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlotLineChart;
