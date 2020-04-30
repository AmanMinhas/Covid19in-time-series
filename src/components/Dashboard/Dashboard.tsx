import React from 'react'
import { IDaySummary } from '../../pages/Home/Home'
import { DashboardDataBox } from './';
import './Dashboard.scss';

interface Props {
  summary: IDaySummary;
}

const Dashboard = ({ summary }: Props) => {
  const { total, discharged, deaths } = summary;
  const className = 'c-Dashboard';
  return (
    <div className={className}>
      <DashboardDataBox
        type='total-cases'
        title='Total Confirmed Cases'
        count={total}
      />
      <div className={`${className}__sub-box-container`}>
        <DashboardDataBox
          type='active-cases'
          title='Active Cases'
          count={total - discharged - deaths}
        />
        <DashboardDataBox
          type='recovered'
          title='Recovered'
          count={discharged}
        />
        <DashboardDataBox
          type='diseased'
          title='Diseased'
          count={deaths}
        />
      </div>
    </div>
  )
}

export default Dashboard;
