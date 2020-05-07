import React from 'react'
import { IDaySummary } from '../../pages/Home/Home'
import { DashboardDataBox } from './';
import { useTranslation } from 'react-i18next';
import './Dashboard.scss';

interface Props {
  summary: IDaySummary;
}

const Dashboard = ({ summary }: Props) => {
  const { t } = useTranslation();
  const { total, discharged, deaths } = summary;
  const className = 'c-Dashboard';

  return (
    <div className={className}>
      <DashboardDataBox
        type='total-cases'
        title={t('totalConfirmedCases')}
        count={total}
      />
      <div className={`${className}__sub-box-container`}>
        <DashboardDataBox
          type='active-cases'
          title={t('activeCases')}
          count={total - discharged - deaths}
        />
        <DashboardDataBox
          type='recovered'
          title={t('recovered')}
          count={discharged}
        />
        <DashboardDataBox
          type='diseased'
          title={t('deaths')}
          count={deaths}
        />
      </div>
    </div>
  )
}

export default Dashboard;
