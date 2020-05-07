import React from 'react'
import Modal from 'react-modal';
import './SelectLanguageModal.scss';

interface ILanguage {
  key: string;
  label: string;
}

interface IProps {
  isOpen: boolean;
  selectedLanguage: string;
  handleSetLanguage: (language: string) => void;
}

const languages: ILanguage[] = [
  {
    key: 'en',
    label: 'English'
  },
  {
    key: 'hi',
    label: 'हिन्दी'
  }
];

const SelectLanguageModal = (props: IProps) => {
  const { isOpen, selectedLanguage, handleSetLanguage } = props;
  const className = 'c-SelectLanguageModal';

  const appElement = document.getElementById('root');
  if (!appElement) return null;

  return (
    <div>
      <Modal
        isOpen={isOpen}
        appElement={appElement}
        className={className}
      >
        <div className={`${className}__container`}>
          {languages.map((language: ILanguage, key: number) => {
            const selected = selectedLanguage === language.key;
            const labelClassName = [
              `${className}__language-label`,
              selected ? ` ${className}__language-label--selected` : ''
            ].join('');

            return (
              <div
                key={key}
                className={`${className}__language-row`}
                onClick={() => handleSetLanguage(language.key)}
              >
                <p className={labelClassName}>
                  {language.label}
                </p>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}

export default SelectLanguageModal;
