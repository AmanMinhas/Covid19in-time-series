import React, { useState, useEffect, ReactNode } from 'react';
import ReactGA from 'react-ga';
import { getUniqueColor } from '../../utils/color';
import regionsMap, { getRegionKey } from '../../utils/regionsMap';
import { useTranslation } from 'react-i18next';

interface Props {
  children: ReactNode;
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
  setSelectedRegionsByRegionKeys: (regionKeys: string[]) => void;
  resetRegions: () => void;
  language: string;
  setLanguage: (language: string) => void;
}

const initialValues: IValues = {
  selectedRegionsMetadata: [],
  addRegionMetadata: (name: string) => {}, // eslint-disable-line
  removeRegionMetadata: (name: string) => {}, // eslint-disable-line
  setSelectedRegionsByRegionKeys: (regionKeys: string[]) => {}, // eslint-disable-line
  resetRegions: () => {}, // eslint-disable-line
  language: '',
  setLanguage: (language: string) => {}, // eslint-disable-line
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
    const color = getUniqueColor(colorsInUse);
    if (!color) return;
    const newRegionMetadata = {
      name,
      regionKey,
      dataKey,
      color,
    };

    setSelectedRegionsMetadata([...selectedRegionsMetadata, newRegionMetadata]);
  };

  const removeRegionMetadata = (name: string) => {
    setSelectedRegionsMetadata(
      selectedRegionsMetadata.filter((regionMetadata: IRegionPlotMetaData) => {
        return regionMetadata.name !== name;
      })
    );
  };

  const setSelectedRegionsByRegionKeys = (regionKeys: string[]) => {
    const colorsInUse: string[] = [];

    const newSelectedRegionsMetadata = regionKeys
      .map((regionKey: string) => {
        const name = regionsMap[regionKey];
        const dataKey = t(`region.${regionKey}`);
        const existingEntry = selectedRegionsMetadata.find(
          (selectedRegionMetadata: IRegionPlotMetaData) => selectedRegionMetadata.regionKey === regionKey
        );
        const color = existingEntry ? existingEntry.color : getUniqueColor(colorsInUse);
        if (!color) return null;
        colorsInUse.push(color);
        const regionMetadata: IRegionPlotMetaData = {
          name,
          regionKey,
          dataKey,
          color,
        };
        return regionMetadata;
      })
      .filter((metaData: IRegionPlotMetaData | null) => !!metaData) as IRegionPlotMetaData[];

    setSelectedRegionsMetadata(newSelectedRegionsMetadata);
  };

  const resetRegions = () => {
    setSelectedRegionsMetadata([]);
    ReactGA.event({
      category: 'Clear All Regions',
      action: 'User clicked clear',
    });
  };

  const value = {
    selectedRegionsMetadata,
    addRegionMetadata,
    removeRegionMetadata,
    setSelectedRegionsByRegionKeys,
    resetRegions,
    language,
    setLanguage,
  };

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
    ReactGA.event({
      category: 'Select Language',
      action: `${language} language selected`,
      label: language,
    });
  }, [language, i18n]);

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export default Global;
