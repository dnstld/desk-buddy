import React, { Component, ErrorInfo, ReactNode } from "react";
import ErrorFallback from "../error-fallback";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (__DEV__) {
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.error("🚨 Error Boundary Caught an Error:");
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.error("Error:", error);
      console.error("Error Info:", errorInfo);
      console.error("Component Stack:", errorInfo.componentStack);
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    // TODO: Send error to production error tracking service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    // Example: Bugsnag.notify(error, event => {
    //   event.addMetadata('react', errorInfo);
    // });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      if (fallback) {
        return fallback(error, this.resetError);
      }

      return <ErrorFallback error={error} resetError={this.resetError} />;
    }

    return children;
  }
}

export default ErrorBoundary;
