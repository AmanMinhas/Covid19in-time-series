import React from 'react'
import { IRegion } from '../../pages/Home/Home';
import { CaseTypes } from '../TopCases/TopCases';
import './RegionCard.scss';

interface Props {
  region: IRegion;
}

interface ILabelValMap {
  label: string;
  value: number;
  type: CaseTypes;
}

const RegionCard = ({ region }: Props) => {
  const className = 'c-RegionCard';

  const renderHeader = () => {
    const { loc } = region;
    const bgColorStyle = {};

    return (
      <div
        className={`${className}__header-row`}
        style={bgColorStyle}
      >
        <p>{loc}</p>
        <button>
          Plot on Graph
        </button>
      </div>
    )
  }

  const renderData = () => {
    const { totalConfirmed, discharged, deaths } = region;
    const activeCases = totalConfirmed - discharged - deaths;
    const labelValMap: ILabelValMap[] = [
      {
        label: 'Total',
        value: totalConfirmed,
        type: 'total-cases'
      },
      {
        label: 'Active',
        value: activeCases,
        type: 'active-cases'
      },
      {
        label: 'Recovered',
        value: discharged,
        type: 'recovered'
      },
      {
        label: 'Diseased',
        value: deaths,
        type: 'diseased'
      }
    ];

    return (
      <div className={`${className}__data-container`}>
        {
          labelValMap.map((data: ILabelValMap, key: number) => {
            const countClassName = [
              `${className}__box-count-value`,
              `${className}__box-count-value--${data.type}`
            ].join(' ');

            return (
              <div key={key} className={`${className}__box`}>
                <div className={`${className}__box-label`}>{data.label}</div>
                <div className={countClassName}>{data.value.toLocaleString()}</div>
              </div>
            );
          })
        }
      </div>
    )
  }

  return (
    <div className={className}>
      {renderHeader()}
      {renderData()}
    </div>
  )
}

export default RegionCard;
