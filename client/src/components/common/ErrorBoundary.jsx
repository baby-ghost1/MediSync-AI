import { Component } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Button from "@/components/ui/Button";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30 ring-1 ring-red-200 dark:ring-red-900/50">
              <AlertTriangle size={32} className="text-red-600 dark:text-red-400" />
            </div>

            <h1 className="mb-2 text-2xl font-bold text-[var(--foreground)]">
              Something went wrong
            </h1>

            <p className="mb-8 text-sm leading-relaxed text-[var(--muted-foreground)]">
              An unexpected error occurred. Our team has been notified.
            </p>

            {this.props.showDetails && this.state.error && (
              <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-left">
                <p className="mb-1 font-mono text-sm font-semibold text-red-600 dark:text-red-400">
                  {this.state.error.name}: {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <pre className="max-h-32 overflow-auto text-xs text-[var(--muted-foreground)]">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                leftIcon={<Home size={18} />}
                onClick={() => { this.handleReset(); window.location.href = "/"; }}
              >
                Go Home
              </Button>

              <Button
                variant="primary"
                leftIcon={<RefreshCw size={18} />}
                onClick={() => {
                  this.handleReset();
                  window.location.reload();
                }}
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
