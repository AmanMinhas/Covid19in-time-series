import React, { ReactNode } from 'react'
import './Box.scss';

interface Props {
  children: ReactNode;
  // children: any;
}

const Box = ({ children }: Props) => {
  return (
    <div className='c-Box'>
      {children}
    </div>
  )
}

export default Box
