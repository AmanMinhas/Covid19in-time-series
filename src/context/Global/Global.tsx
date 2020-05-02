import React, { useState, ReactNode } from 'react';
import { IRegion } from '../../pages/Home/Home';
import { getUniqueColor } from '../../utils/color';

interface Props {
  children: ReactNode
}

export interface IRegionPlotMetaData {
  name: string;
  color: string;
  dataKey: string;
}

interface IValues {
  selectedRegionsMetadata: IRegionPlotMetaData[];
  addRegionMetadata: (name: string) => void;
  removeRegionMetadata: (name: string) => void;
}

const initialValues: IValues = {
  selectedRegionsMetadata: [],
  addRegionMetadata: (name: string) => { },
  removeRegionMetadata: (name: string) => { }
};

export const GlobalContext = React.createContext(initialValues);

const Global = ({ children }: Props) => {
  const [selectedRegionsMetadata, setSelectedRegionsMetadata] = useState<IRegionPlotMetaData[]>([]);

  const addRegionMetadata = (name: string) => {
    const colorsInUse = selectedRegionsMetadata.map(({ color }: IRegionPlotMetaData) => color);
    const newRegionMetadata = {
      name,
      dataKey: name,
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
    removeRegionMetadata
  }

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

export default Global;