import React from 'react';
import Home from '../../pages/Home';
import Navbar from '../Navbar';
import './App.scss';

const App = () => {
  const className = 'c-App';

  return (
    <div className={className}>
      <Navbar />
      <div className={`${className}__inner`}>
        <Home />
      </div>
    </div>
  );
};

export default App;
