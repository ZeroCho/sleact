import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

import App from './layouts/App';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3090';

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#app'),
);
