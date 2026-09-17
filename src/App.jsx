import React, { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { Progress } from './pages/Progress';
import { Parent } from './pages/Parent';
import { Settings } from './pages/Settings';
import { Onboarding } from './pages/Onboarding';
import { getState } from './lib/db';
import { AppProvider } from './store/AppContext';
import './styles/app.css';

function Inner() {
  const [page, setPage] = useState('home');
  const [initialSubject, setInitialSubject] = useState('all');

  const handleOpenSubject = (subjId) => {
    setInitialSubject(subjId);
    setPage('learn');
  };

  return (
    <Layout page={page} setPage={setPage}>
      {page === 'home' && <Home go={setPage} openSubject={handleOpenSubject} />}
      {page === 'learn' && <Learn initialSubject={initialSubject} />}
      {page === 'progress' && <Progress />}
      {page === 'parent' && <Parent />}
      {page === 'settings' && <Settings />}
    </Layout>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    getState('children', []).then((v) => {
      setHasProfile(Array.isArray(v) && v.length > 0);
      setReady(true);
    });
  }, []);

  return (
    <AppProvider>
      {!ready ? (
        <div className="loading">Loading MerolaApp Enterprise…</div>
      ) : !hasProfile ? (
        <Onboarding done={() => setHasProfile(true)} />
      ) : (
        <Inner />
      )}
    </AppProvider>
  );
}
