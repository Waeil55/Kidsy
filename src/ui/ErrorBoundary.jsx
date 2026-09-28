import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Kidsy ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'var(--bg, #fdf6ec)',
          fontFamily: 'inherit',
          boxSizing: 'border-box'
        }}>
          <div style={{
            maxWidth: 480,
            width: '100%',
            background: 'var(--card-bg, #ffffff)',
            borderRadius: 24,
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            border: '2px solid rgba(0,0,0,0.05)'
          }}>
            <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: 12 }}>🦊</span>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem' }}>Oops! Let's get you back on track</h2>
            <p style={{ margin: '0 0 20px 0', color: 'var(--ink2, #666)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Something took a tiny pause. Don't worry, your progress is safely saved!
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReset}
                style={{
                  background: 'var(--primary, #ff7a00)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 16,
                  padding: '12px 24px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                🏠 Back to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'var(--soft, #f1f3f5)',
                  color: 'var(--ink, #222)',
                  border: 'none',
                  borderRadius: 16,
                  padding: '12px 24px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                🔄 Reload App
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
