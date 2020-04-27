import React from 'react';
import { IStats, IRegion } from '../../pages/Home/Home';

interface TopFiveProps {
  stats: IStats
}

const getTopActiveCases = (regionalData: IRegion[], topCount: number) => {
  return [...regionalData]
    .sort((a: IRegion, b: IRegion) => {
      const aActiveCases = a.totalConfirmed - a.discharged;
      const bActiveCases = b.totalConfirmed - b.discharged;

      return bActiveCases - aActiveCases;
    })
    .splice(0, topCount);
}

const TopFive = (props: TopFiveProps) => {
  const { stats: { data } } = props;
  const className = 'c-TopFive';

  const lastDayData = data[data.length - 1];

  const topActiveCases = getTopActiveCases(lastDayData.regional, 10);

  return (
    <div className={className}>
      <h2>Top 10 Active Cases</h2>
      {
        topActiveCases.map((state: IRegion, key: number) => {
          const { loc, totalConfirmed, discharged } = state;
          const activeCases = totalConfirmed - discharged;
          return (
            <div key={key} style={{ padding: '8px 0' }}>
              <strong>{loc} : </strong> {activeCases}
            </div>
          )
        })
      }
    </div>
  );
}

export default TopFive;