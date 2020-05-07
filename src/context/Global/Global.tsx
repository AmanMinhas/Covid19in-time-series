import React, { useState, useEffect, ReactNode } from 'react';
import ReactGA from 'react-ga';
// import { IRegion } from '../../pages/Home/Home';
import { getUniqueColor } from '../../utils/color';
import { getRegionKey } from '../../utils/regionsMap';
import { useTranslation } from 'react-i18next';

interface Props {
  children: ReactNode
}

export interface IRegionPlotMetaData {
  name: string;
  color: string;
  dataKey: string;
  regionKey: string;
}

interface IValues {
  selectedRegionsMetadata: IRegionPlotMetaData[];
  addRegionMetadata: (name: string) => void;
  removeRegionMetadata: (name: string) => void;
  language: string;
  setLanguage: (language: string) => void;
}

const initialValues: IValues = {
  selectedRegionsMetadata: [],
  addRegionMetadata: (name: string) => { },
  removeRegionMetadata: (name: string) => { },
  language: '',
  setLanguage: (language: string) => { },
};

export const GlobalContext = React.createContext(initialValues);

const Global = ({ children }: Props) => {
  const { i18n } = useTranslation();

  const [language, setLanguage] = useState('');
  const [selectedRegionsMetadata, setSelectedRegionsMetadata] = useState<IRegionPlotMetaData[]>([]);
  const { t } = useTranslation();

  const addRegionMetadata = (name: string) => {
    const colorsInUse = selectedRegionsMetadata.map(({ color }: IRegionPlotMetaData) => color);
    const regionKey = getRegionKey(name);
    if (!regionKey) return;

    const dataKey = t(`region.${regionKey}`);
    const newRegionMetadata = {
      name,
      regionKey,
      dataKey,
      color: getUniqueColor(colorsInUse)
    };

    setSelectedRegionsMetadata([
      ...selectedRegionsMetadata,
      newRegionMetadata
    ]);
  }

  const removeRegionMetadata = (name: string) => {
    setSelectedRegionsMetadata(
      selectedRegionsMetadata.filter((regionMetadata: IRegionPlotMetaData) => {
        return regionMetadata.name !== name
      })
    );
  }

  const value = {
    selectedRegionsMetadata,
    addRegionMetadata,
    removeRegionMetadata,
    language,
    setLanguage
  }

  useEffect(() => {
    const gaTrackingId = process.env.REACT_APP_GA_TRACKING_ID;
    if (gaTrackingId) {
      ReactGA.initialize(gaTrackingId);
      ReactGA.pageview(window.location.pathname + window.location.search);
    }

    // Language Preference
    const preferredLanguage = localStorage.getItem('preferredLanguage');
    if (preferredLanguage) setLanguage(preferredLanguage);
  }, []);

  useEffect(() => {
    if (!language) return;
    localStorage.setItem('preferredLanguage', language);
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

export default Global;