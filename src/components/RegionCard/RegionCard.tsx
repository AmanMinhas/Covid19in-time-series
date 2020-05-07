import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next';
import { IRegion } from '../../pages/Home/Home';
import { CaseTypes } from '../TopCases/TopCases';
import { GlobalContext } from '../../context/Global';
import { IRegionPlotMetaData } from '../../context/Global/Global';
import ReactGA from 'react-ga';
import './RegionCard.scss';
import { getRegionKey } from '../../utils/regionsMap';


interface Props {
  region: IRegion;
}

interface ILabelValMap {
  label: string;
  value: number;
  type: CaseTypes;
}

const RegionCard = ({ region }: Props) => {
  const {
    selectedRegionsMetadata,
    addRegionMetadata,
    removeRegionMetadata
  } = useContext(GlobalContext);
  const { t } = useTranslation();

  if (
    !selectedRegionsMetadata ||
    !addRegionMetadata ||
    !removeRegionMetadata
  ) return null;

  const { loc } = region;
  const className = 'c-RegionCard';

  const isSelected = !!selectedRegionsMetadata.find(
    (regionMetadata: IRegionPlotMetaData) => loc === regionMetadata.name
  );

  const handleActionButtonClick = () => {
    if (!isSelected) {
      addRegionMetadata(loc);
      ReactGA.event({
        category: 'Plot on Graph',
        action: 'User clicked Plot on Graph',
        label: loc
      });
    } else {
      removeRegionMetadata(loc);
      ReactGA.event({
        category: 'Remove from Graph',
        action: 'User clicked Remove from Graph',
        label: loc
      });
    }
  }

  const buttonLabel = isSelected ? t('removeFromGraph') : t('plotOnGraph');

  const renderHeader = () => {
    const { loc } = region;
    const regionKey = getRegionKey(loc);
    const regionName = regionKey ? t(`region.${regionKey}`, loc) : loc;
    const bgColorStyle = {};

    return (
      <div
        className={`${className}__header-row`}
        style={bgColorStyle}
      >
        <p>{regionName}</p>
        <button onClick={() => handleActionButtonClick()}>
          {buttonLabel}
        </button>
      </div>
    )
  }

  const renderData = () => {
    const { totalConfirmed, discharged, deaths } = region;
    const activeCases = totalConfirmed - discharged - deaths;
    const labelValMap: ILabelValMap[] = [
      {
        label: t('shortTotalConfirmedCases'),
        value: totalConfirmed,
        type: 'total-cases'
      },
      {
        label: t('shortActiveCases'),
        value: activeCases,
        type: 'active-cases'
      },
      {
        label: t('recovered'),
        value: discharged,
        type: 'recovered'
      },
      {
        label: t('shortDeaths'),
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
