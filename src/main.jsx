import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './kidplay/NewDesign.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[MerolaApp Critical Error Caught by Boundary]:', error, errorInfo);
  }

  handleRestart = () => {
    try {
      sessionStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  handleFullReset = () => {
    try {
      sessionStorage.clear();
      localStorage.clear();
      if ('caches' in window) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
      }
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'linear-gradient(180deg, #dbeafe 0%, #ffffff 100%)',
            fontFamily: "'Fredoka', -apple-system, sans-serif",
            textAlign: 'center',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '12px' }}>🦖✨</div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e3a8a', margin: '0 0 8px' }}>
            Explorer Break!
          </h2>
          <p style={{ fontSize: '15px', color: '#475569', maxWidth: '340px', margin: '0 0 24px', lineHeight: 1.4 }}>
            MerolaApp encountered a small bump on the trail. Let's restart your learning quest!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
            <button
              onClick={this.handleRestart}
              style={{
                background: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                border: 0,
                borderRadius: '99px',
                padding: '12px 20px',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
              }}
            >
              Restart Adventure 🚀
            </button>
            <button
              onClick={this.handleFullReset}
              style={{
                background: '#ffffff',
                color: '#64748b',
                border: '1.5px solid #cbd5e1',
                borderRadius: '99px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Reset Cache & Data
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

