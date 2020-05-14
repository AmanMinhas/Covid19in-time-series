import React from 'react';
import { useTranslation } from 'react-i18next';
import { sources, ISource } from '../../utils/sources';
import './Sources.scss';

const Sources = () => {
  const className = 'c-Sources';
  const { t } = useTranslation();

  return (
    <div className={className}>
      <p className={`${className}__title`}>{t('sources')}</p>
      {sources.map(({ label, value }: ISource, key: number) => {
        return (
          <div key={key}>
            <span>{t(`${label}`)}</span> : {value}
          </div>
        );
      })}
    </div>
  );
};

export default Sources;
