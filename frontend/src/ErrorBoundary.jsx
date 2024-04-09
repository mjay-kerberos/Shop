import React, { Component } from 'react';
import './ErrorFallback.css'
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h1>Sorry, Rathars Destroyed the control center.</h1>
          <p>Rathars.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
