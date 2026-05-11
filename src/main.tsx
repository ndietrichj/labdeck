import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  </React.StrictMode>
);
