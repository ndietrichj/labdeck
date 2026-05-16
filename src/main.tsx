import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { GitUpdateSplash } from './components/GitUpdateSplash';
import './styles/global.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <React.StrictMode>
      {showSplash && <GitUpdateSplash onComplete={() => setShowSplash(false)} />}
      <AppLayout>
        <DashboardPage />
      </AppLayout>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);
