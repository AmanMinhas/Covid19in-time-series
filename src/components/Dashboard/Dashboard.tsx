import React from 'react';
import { IDaySummary } from '../../pages/Home/Home';
import { DashboardDataBox } from './';
import { useTranslation } from 'react-i18next';
import format from 'date-fns/format';
import { hi } from 'date-fns/locale';
import './Dashboard.scss';

interface Props {
  summary: IDaySummary;
  lastRefreshed: string;
}

interface ILocaleMap {
  [key: string]: Locale;
}

const Dashboard = ({ summary, lastRefreshed }: Props) => {
  const { t, i18n } = useTranslation();
  const { total, discharged, deaths } = summary;
  const className = 'c-Dashboard';

  const { language } = i18n;
  const isEnglish = language === 'en';
  const lastRefreshedDate = new Date(lastRefreshed);

  const localeMap: ILocaleMap = { hi: hi };
  const formatOptions =
    !language || !localeMap.hasOwnProperty(language) || isEnglish ? {} : { locale: localeMap[language] };

  const formattedLastRefreshedDate = format(lastRefreshedDate, `PPPPp`, formatOptions);

  return (
    <div className={className}>
      <div className={`${className}__last-updated-container`}>
        <p className={`${className}__last-updated-container__p`}>
          {t('lastUpdatedOn')} : <strong>{formattedLastRefreshedDate}</strong>
        </p>
      </div>
      <DashboardDataBox type="total-cases" title={t('totalConfirmedCases')} count={total} />
      <div className={`${className}__sub-box-container`}>
        <DashboardDataBox type="active-cases" title={t('activeCases')} count={total - discharged - deaths} />
        <DashboardDataBox type="recovered" title={t('recovered')} count={discharged} />
        <DashboardDataBox type="diseased" title={t('deaths')} count={deaths} />
      </div>
    </div>
  );
};

export default Dashboard;
