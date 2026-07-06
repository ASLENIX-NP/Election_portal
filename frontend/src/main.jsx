import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { KioskProvider } from './context/KioskContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <KioskProvider>
      <App />
    </KioskProvider>
  </StrictMode>
);