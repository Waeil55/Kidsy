import React, { useEffect, useState } from 'react';
import { DeviceFrame } from './components/DeviceFrame';
import { WelcomeSplash } from './pages/WelcomeSplash';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { Progress } from './pages/Progress';
import { Parent } from './pages/Parent';
import { Settings } from './pages/Settings';
import { getState } from './lib/db';
import { AppProvider, useApp } from './store/AppContext';
import { Layout } from './components/Layout';
import './styles/app.css';

function MainAppShell() {
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
      {page === 'settings' && <Settings onShowTour={() => window.location.reload()} />}
    </Layout>
  );
}

function RootNavigator() {
  const [flowStep, setFlowStep] = useState('loading'); // 'loading' | 'splash' | 'onboarding' | 'main'

  useEffect(() => {
    getState('has_seen_splash', false).then((seen) => {
      getState('children', []).then((kids) => {
        const hasKids = Array.isArray(kids) && kids.length > 0;
        if (!seen) {
          setFlowStep('splash');
        } else if (!hasKids) {
          setFlowStep('onboarding');
        } else {
          setFlowStep('main');
        }
      });
    });
  }, []);

  if (flowStep === 'loading') {
    return (
      <DeviceFrame>
        <div className="loading" style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
          Loading MerolaApp Adventure…
        </div>
      </DeviceFrame>
    );
  }

  // Screen 1: Welcome Splash
  if (flowStep === 'splash') {
    return (
      <DeviceFrame isDarkStatus={true}>
        <WelcomeSplash
          onContinue={() => setFlowStep('onboarding')}
          onSkip={() => {
            localStorage.setItem('merola_v2_has_seen_splash', 'true');
            setFlowStep('main');
          }}
        />
      </DeviceFrame>
    );
  }

  // Screen 2: Create Child Profile
  if (flowStep === 'onboarding') {
    return (
      <DeviceFrame isDarkStatus={false}>
        <Onboarding
          onBack={() => setFlowStep('splash')}
          done={() => {
            localStorage.setItem('merola_v2_has_seen_splash', 'true');
            setFlowStep('main');
          }}
        />
      </DeviceFrame>
    );
  }

  // Screen 3 & Core App
  return (
    <DeviceFrame isDarkStatus={false}>
      <MainAppShell />
    </DeviceFrame>
  );
}

export default function App() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}
