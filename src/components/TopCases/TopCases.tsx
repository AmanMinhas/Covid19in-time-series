import React from 'react'
import { IStats, IRegion } from '../../pages/Home/Home';
import RegionCard from '../RegionCard';
import './TopCases.scss';

export type CaseTypes = 'total-cases' | 'active-cases' | 'recovered' | 'diseased';

interface Props {
  stats: IStats
  type: CaseTypes;
  count: number;
}

const getTopCases = (regionalData: IRegion[], type: CaseTypes, topCount: number) => {
  return regionalData
    .sort((a: IRegion, b: IRegion) => {
      switch (type) {
        case 'total-cases': {
          return b.totalConfirmed - a.totalConfirmed;
        }
        case 'active-cases': {
          const aActiveCases = a.totalConfirmed - a.discharged - a.deaths;
          const bActiveCases = b.totalConfirmed - b.discharged - b.deaths;
          return bActiveCases - aActiveCases;
        }
        case 'recovered': {
          return b.discharged - a.discharged;
        }
        case 'diseased': {
          return b.deaths - a.deaths;
        }
        default: {
          return b.totalConfirmed - a.totalConfirmed;
        }
      }
    })
    .splice(0, topCount);
}

const getTitleByCountAndType = (count: number, type: CaseTypes) => {
  const prefix = `Top ${count} `;
  switch (type) {
    case 'total-cases': {
      return `${prefix}Total Confirmed Cases`;
    }
    case 'active-cases': {
      return `${prefix}Active Cases`;
    }
    case 'recovered': {
      return `${prefix}Recovered Cases`;
    }
    case 'diseased': {
      return `${prefix}Diseased Cases`;
    }
    default: {
      return '';
    }
  }
}

const TopCases = (props: Props) => {
  const { stats: { data }, type, count } = props;
  const className = 'c-TopCases';

  if (!count) return null;

  const lastDayData = data[data.length - 1];
  const topCases = getTopCases(
    [...lastDayData.regional],
    type,
    count
  );

  const title = getTitleByCountAndType(count, type);

  return (
    <div className={className}>
      <p className={`${className}__title`}>{title}</p>
      <div>
        {topCases.map((region: IRegion, key: number) => {
          return (
            <RegionCard key={key} region={region} />
          )
        })}
      </div>
    </div>
  )
}

export default TopCases
