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
          <div key={key} className={`${className}__row`}>
            <a rel="noopener noreferrer" target="_blank" href={value}>
              {t(`${label}`)}
            </a>
          </div>
        );
      })}
      <div className={`${className}__row`}>
        <a rel="noopener noreferrer" target="_blank" href="https://icons8.com/icons/set/coronavirus">
          Coronavirus icon
        </a>{' '}
        icon by{' '}
        <a rel="noopener noreferrer" target="_blank" href="https://icons8.com">
          Icons8
        </a>
      </div>
      <div className={`${className}__row`}>
        <a rel="noopener noreferrer" target="_blank" href="https://icons8.com/icons/set/literature">
          Literature icon
        </a>{' '}
        icon by{' '}
        <a rel="noopener noreferrer" target="_blank" href="https://icons8.com">
          Icons8
        </a>
      </div>
      <div className={`${className}__row`}>
        <a
          className={`${className}__row__linkedin-contact`}
          rel="noopener noreferrer"
          target="_blank"
          href="https://www.linkedin.com/in/aman-minhas-16186b72/"
        >
          {t('builtByName')}
        </a>
      </div>
    </div>
  );
};

export default Sources;
