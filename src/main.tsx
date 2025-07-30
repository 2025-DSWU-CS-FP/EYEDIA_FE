import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import App from './App';
import './index.css';

const script = document.createElement('script');
script.type = 'text/javascript';
document.head.appendChild(script);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
