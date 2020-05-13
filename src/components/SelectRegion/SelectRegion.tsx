import React, { useState, useContext, useEffect } from 'react'
import Modal from 'react-modal';
import { GlobalContext } from '../../context/Global'
import { useTranslation } from 'react-i18next';
import { IRegionPlotMetaData } from '../../context/Global/Global';
import regionsMap from '../../utils/regionsMap';
import ReactGA from 'react-ga';
import './SelectRegion.scss';

const SelectRegion = () => {
  const {
    selectedRegionsMetadata,
    setSelectedRegionsByRegionKeys
  } = useContext(GlobalContext);

  const [showModal, setShowModal] = useState(false);
  const [selectedRegionKeys, setSelectedRegionKeys] = useState<string[]>([]);

  const { t } = useTranslation();

  const className = 'c-SelectRegion';
  const modalClassName = `${className}__modal`;

  const regionKeys = Object.keys(regionsMap);
  const appElement = document.getElementById('root');

  const resetSelectedRegions = () => {
    const selectedRegionKeys = selectedRegionsMetadata.map(
      (regionMetadata: IRegionPlotMetaData) => regionMetadata.regionKey
    );
    setSelectedRegionKeys(selectedRegionKeys);
  }

  const handleRegionClick = (regionKey: string) => {
    if (selectedRegionKeys.includes(regionKey)) {
      const updatedKeys = selectedRegionKeys.filter(
        (selectedRegionKey: string) => selectedRegionKey !== regionKey
      );
      setSelectedRegionKeys(updatedKeys);
    } else {
      setSelectedRegionKeys([
        ...selectedRegionKeys,
        regionKey
      ]);
    }
  }

  const handleApplyClick = () => {
    setSelectedRegionsByRegionKeys(selectedRegionKeys);
    setShowModal(false);

    selectedRegionKeys.forEach((regionKey: string) => {
      ReactGA.event({
        category: 'Plot on Graph',
        action: 'User selected location from SelectRegion modal',
        label: regionsMap[regionKey]
      });
    })
  }

  const handleCloseModal = () => {
    setShowModal(false);
    resetSelectedRegions();
  }

  useEffect(() => {
    const selectedRegionKeys = selectedRegionsMetadata.map(
      (regionMetadata: IRegionPlotMetaData) => regionMetadata.regionKey
    );
    setSelectedRegionKeys(selectedRegionKeys);
  }, [selectedRegionsMetadata]);

  if (!appElement) return null;

  return (
    <div className={className}>
      <div
        className={`${className}__modal-trigger`}
        onClick={() => setShowModal(true)}
      >
        {t('selectStates')}
      </div>
      <Modal
        appElement={appElement}
        isOpen={showModal}
        className={modalClassName}
        onRequestClose={handleCloseModal}
        shouldCloseOnOverlayClick={false}
      >
        <div className={`${modalClassName}__inner`}>
          <div className={`${modalClassName}__inner__container`}>
            <div className={`${modalClassName}__inner__regions-list`}>
              {regionKeys.map((regionKey, key) => {
                const itemClassName = [
                  `${modalClassName}__inner__regions-list__item`,
                  selectedRegionKeys.includes(regionKey) ? ` ${modalClassName}__inner__regions-list__item--selected` : ''
                ].join('');
                return (
                  <div
                    key={key}
                    className={itemClassName}
                    onClickCapture={() => handleRegionClick(regionKey)}
                  >

                    {t(`region.${regionKey}`)}
                  </div>
                )
              })}
            </div>
          </div>
          <div className={`${modalClassName}__inner__action-btns-col`}>
            <div
              className={[
                `${modalClassName}__inner__action-btns-col__item`,
                `${modalClassName}__inner__action-btns-col__item--apply`
              ].join(' ')}
              onClick={handleApplyClick}
            >
              {t('apply')}
            </div>
            <div
              className={[
                `${modalClassName}__inner__action-btns-col__item`,
                `${modalClassName}__inner__action-btns-col__item--cancel`
              ].join(' ')}
              onClick={handleCloseModal}
            >
              {t('cancel')}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SelectRegion
