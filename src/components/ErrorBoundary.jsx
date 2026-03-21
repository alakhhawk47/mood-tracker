import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-day-bg dark:bg-night-bg flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-card p-8 rounded-3xl shadow-glass border border-gray-100 dark:border-dark-border text-center max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
              !
            </div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              A critical error occurred while rendering the application. 
              {this.state.error?.message && (
                <span className="block mt-2 text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded text-red-400 font-mono text-left overflow-hidden text-ellipsis">
                  {this.state.error.message}
                </span>
              )}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-day-primary dark:bg-night-primary text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
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

export default ErrorBoundary;
