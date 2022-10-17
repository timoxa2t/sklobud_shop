import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'
import {store, persistor} from './store/configureStore'

import './index.css';
import App from './App';

import reportWebVitals from './reportWebVitals';
import { PersistGate } from 'redux-persist/integration/react';


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <CookiesProvider>
            <App />
          </CookiesProvider>
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


reportWebVitals();
