import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/app.css';
import { startAnalytics } from './lib/analytics.js';
import App from './App.jsx';

startAnalytics();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
