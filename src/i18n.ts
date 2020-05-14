import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import localeResources from './utils/localeResources';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: localeResources,
    lng: localStorage.getItem('preferredLanguage') || 'en',
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
