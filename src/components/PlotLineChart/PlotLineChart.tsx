import React, { useState, useEffect } from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, ResponsiveContainer } from 'recharts';
import { IStats, ISelectedState, IDayData, IRegion } from '../../pages/Home/Home';
import './PlotLineChart.scss';

interface PlotLineChartProps {
  stats: IStats;
  selectedStates: ISelectedState[];
}

const PlotLineChart = (props: PlotLineChartProps) => {
  const { stats, selectedStates } = props;
  const [lineData, setLineData] = useState<any>([]);
  const className = 'c-PlotLineChart';

  useEffect(() => {
    if (stats) {
      const { data } = stats;

      const formattedLineData = data.map((dayData: IDayData) => {
        const { day, summary, regional } = dayData;
        const shortDay = day
          .replace('2020-', '')
          .replace('-', '/');

        let includeCountryData = false;
        let statesData = {};
        selectedStates.forEach((state: ISelectedState) => {
          if (state.name === 'India') {
            includeCountryData = true;
            return;
          }
          const details = regional.find((region: IRegion) => region.loc === state.name);
          if (details) {
            const { totalConfirmed, discharged, deaths } = details;
            statesData = {
              ...statesData,
              [state.dataKey]: totalConfirmed - discharged - deaths
            };
          }
        })

        const countryData = includeCountryData ? {
          India: summary.total - summary.discharged
        } : {};

        return {
          day: shortDay,
          ...countryData,
          ...statesData
        }
      });

      setLineData(formattedLineData);
    }
  }, [stats, selectedStates])

  if (!lineData.length) return null;
  return (
    <div className={className}>
      <ResponsiveContainer width='100%' height={250}>
        <LineChart width={730} height={250} data={lineData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          {selectedStates.map((stateData) => {
            const { dataKey, color } = stateData;
            return (
              <Line
                key={dataKey}
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                dot={false}
              />
            )
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PlotLineChart;