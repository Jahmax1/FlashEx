import React from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error.message, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    const { theme } = this.props;
    if (this.state.hasError) {
      const isRouterError = this.state.error?.message?.includes('Router');
      return (
        <div
          className={`min-h-screen flex items-center justify-center p-4 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-dark-bg to-[#1A1A3E]'
              : 'bg-gradient-to-br from-light-bg to-[#E5E7EB]'
          }`}
        >
          <div className="glass rounded-2xl p-8 max-w-lg w-full text-center">
            <h2
              className={`text-2xl font-bold mb-4 ${
                theme === 'dark' ? 'text-red-500' : 'text-red-600'
              }`}
            >
              {isRouterError ? 'Routing Error' : 'Something went wrong!'}
            </h2>
            <p
              className={`mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {isRouterError
                ? 'A routing issue occurred. Please reload the page.'
                : this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              className={`px-4 py-2 rounded-lg glow-button ${
                theme === 'dark'
                  ? 'bg-cyan text-dark-bg'
                  : 'bg-cyan text-light-bg'
              } font-semibold`}
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ErrorBoundaryWithTheme = (props) => {
  const { theme } = useContext(ThemeContext);
  return <ErrorBoundary theme={theme} {...props} />;
};

export default ErrorBoundaryWithTheme;