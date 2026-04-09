import React from 'react';

const STYLES = {
  container: {
    background: '#0A0B0F',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: 12,
    padding: 32,
    textAlign: 'center',
    fontFamily: "'DM Sans', sans-serif",
    margin: 8,
  },
  icon: {
    fontSize: 40,
    marginBottom: 16,
    color: '#6366F1',
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: '#E2E8F0',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 1.6,
    marginBottom: 20,
  },
  button: {
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #6366F1, #6D28D9)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    transition: 'opacity 0.2s',
  },
};

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={STYLES.container} role="alert">
          <div style={STYLES.icon}>!</div>
          <div style={STYLES.title}>
            Algo salio mal / Something went wrong
          </div>
          <div style={STYLES.message}>
            Ocurrio un error inesperado. Intenta de nuevo.
            <br />
            An unexpected error occurred. Please try again.
          </div>
          <button
            onClick={this.handleRetry}
            style={STYLES.button}
            aria-label="Reintentar / Retry"
          >
            Reintentar / Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
