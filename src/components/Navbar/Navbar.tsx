import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import './Navbar.scss';
import SelectLanguageModal from '../SelectLanguageModal';
import { GlobalContext } from '../../context/Global';

const Navbar = () => {
  const preferredLanguage = localStorage.getItem('preferredLanguage') || '';
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(!preferredLanguage);
  const { language, setLanguage } = useContext(GlobalContext)
  const { t } = useTranslation();
  const className = 'c-Navbar';

  const handleSetLanguage = (language: string) => {
    setIsLanguageSelectorOpen(false);
    setLanguage(language);
  }

  const localeLabel = 'ह | A';

  return (
    <div className={className}>
      <p className={`${className}__central-content`}>{t('timeSeriesInIndia')}</p>
      <div
        className={`${className}__language-change-button`}
        onClick={() => setIsLanguageSelectorOpen(true)}
      >
        {localeLabel}
      </div>
      <SelectLanguageModal
        isOpen={isLanguageSelectorOpen}
        selectedLanguage={language}
        handleSetLanguage={handleSetLanguage}
        handleClose={() => setIsLanguageSelectorOpen(false)}
      />
    </div>
  )
}

export default Navbar;
