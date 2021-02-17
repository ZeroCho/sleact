import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from '@layouts/App';

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#app'),
);

// pages - 서비스 페이지
// components - 짜잘 컴포넌트
// layouts - 공통 레이아웃
