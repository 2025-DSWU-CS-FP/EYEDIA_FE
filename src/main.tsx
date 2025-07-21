import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import App from './App';
import './index.css';

const script = document.createElement('script');
script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAPS_KEY}`;
script.type = 'text/javascript';
document.head.appendChild(script);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
