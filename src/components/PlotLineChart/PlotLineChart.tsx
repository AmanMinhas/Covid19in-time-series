import React, { useState, useEffect } from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip, Line } from 'recharts';
import { selectedStates } from './selectedStates';

interface PlotLineChartProps {
  statesData: any;
}

const PlotLineChart = (props: PlotLineChartProps) => {
  const { statesData } = props;
  const [lineData, setLineData] = useState([]);
  const plotCountry = true;

  useEffect(() => {
    if (statesData) {
      const { data } = statesData;

      const formattedLineData = data.map((dayData: any) => {
        const { day, summary, regional } = dayData;
        const countryData = {
          india: summary.total - summary.discharged
        };
        let statesData = {};
        selectedStates.forEach((state) => {
          const details = regional.find((region: any) => region.loc === state.name) || { totalConfirmed: 0, discharged: 0 };
          const { totalConfirmed, discharged } = details;
          statesData = {
            ...statesData,
            [state.dataKey]: totalConfirmed - discharged
          };
        })

        return {
          day,
          ...countryData,
          ...statesData
        }
      });

      console.log('formattedLineData ', formattedLineData);
      setLineData(formattedLineData);
    }
  }, [statesData])

  if (!lineData.length) return null;
  return (
    <div>
      <LineChart width={730} height={250} data={lineData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        {plotCountry && <Line
          type="monotone"
          dataKey='india'
          stroke='red'
        />}
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
    </div>
  );
}

export default PlotLineChart;