import React, { useState, useEffect } from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip, Line, ResponsiveContainer } from 'recharts';
import { IStats, ISelectedState, IDayData, IRegion } from '../../pages/Home/Home';
// import { selectedStates } from './selectedStates';
import './PlotLineChart.scss';

interface PlotLineChartProps {
  statesData: IStats;
  selectedStates: ISelectedState[];
}

const PlotLineChart = (props: PlotLineChartProps) => {
  const { statesData, selectedStates } = props;
  const [lineData, setLineData] = useState<any>([]);
  const className = 'c-PlotLineChart';

  useEffect(() => {
    if (statesData) {
      const { data } = statesData;

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
          const details = regional.find((region: IRegion) => region.loc === state.name) || { totalConfirmed: 0, discharged: 0 };
          const { totalConfirmed, discharged } = details;
          statesData = {
            ...statesData,
            [state.dataKey]: totalConfirmed - discharged
          };
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
  }, [statesData, selectedStates])

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
          <Legend />
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