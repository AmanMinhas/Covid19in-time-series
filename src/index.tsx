import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import Global from './context/Global';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
// import i18n from './i18n';
import './i18n';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback="loading...">
      <Global>
        <App />
      </Global>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
