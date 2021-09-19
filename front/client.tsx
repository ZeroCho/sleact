import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import SWRDevtools, { Cache } from '@jjordy/swr-devtools';
import { SWRConfig } from 'swr';

import App from './layouts/App';

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.NODE_ENV === 'production' ? 'https://sleact.nodebird.com' : 'http://localhost:3090';
console.log('env', process.env.NODE_ENV === 'production');
render(
  <BrowserRouter>
    <SWRConfig value={{ provider: () => new Cache() }}>
      {process.env.NODE_ENV === 'production' ? null : <SWRDevtools />}
      <App />
    </SWRConfig>
  </BrowserRouter>,
  document.querySelector('#app'),
);
