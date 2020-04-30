import React from 'react';
import './DashboardDataBox.scss';

interface Props {
  type?: string;
  title: string;
  count: number;
  increment?: number;
}

const DashboardDataBox = ({ type, title, count, increment }: Props) => {
  const className = 'c-DashboardDataBox';
  const renderIncrement = increment === 0 || increment;

  const baseCountClassName = `${className}__count`;
  const countClassName = [
    baseCountClassName,
    type ? ` ${baseCountClassName}--${type}` : ''
  ].join('');

  return (
    <div className={className}>
      <div className={`${className}__title`}>
        {title}
      </div>
      <div className={countClassName}>
        {count.toLocaleString()}
      </div>
      {renderIncrement && (
        <div className={`${className}__increment`}>
          {increment}
        </div>
      )}
    </div>
  );
}

export default DashboardDataBox;