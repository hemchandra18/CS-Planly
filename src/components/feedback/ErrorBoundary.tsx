/* ═══════════════════════════════════════════════════════
   CS-Planly — Error Boundary Component v2
   ═══════════════════════════════════════════════════════ */

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="mb-5 text-[var(--color-text-tertiary)]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)] mb-2">
            Something went wrong
          </h2>
          <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] max-w-sm mb-6">
            An unexpected error occurred. Please try again or refresh the page.
          </p>
          {this.state.error && (
            <pre className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] bg-[var(--color-bg-secondary)] rounded-[var(--radius-md)] p-3 mb-6 max-w-md overflow-auto">
              {this.state.error.message}
            </pre>
          )}
          <div className="flex gap-3">
            <Button onClick={this.handleReset}>Try again</Button>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Refresh page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
