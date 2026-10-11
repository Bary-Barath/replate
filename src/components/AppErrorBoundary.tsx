import { Component, type ErrorInfo, type ReactNode } from 'react';

interface AppErrorBoundaryProps { children: ReactNode; }
interface AppErrorBoundaryState { hasError: boolean; errorName?: string; }

/**
 * Prevents an unexpected render error from blanking the complete application.
 * This does not replace request or event-handler error handling.
 */
class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { hasError: true, errorName: error.name };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Keep production logs free of component data and stack traces. Replace this
    // with an approved monitoring adapter when a production backend is connected.
    if (import.meta.env.DEV) console.error('[RePlate] render boundary captured an error');
  }

  handleRetry = () => window.location.reload();

  render() {
    if (!this.state.hasError) return this.props.children;
    return <main className="min-h-[70vh] flex items-center justify-center px-6 py-16"><div className="card max-w-xl p-8 md:p-10 text-center"><p className="eyebrow mb-3">Safe recovery</p><h1 className="text-3xl font-display font-extrabold mb-3">This section could not be loaded.</h1><p className="text-text-secondary mb-7">The rest of RePlate is still available. Try loading this section again or return to the marketplace.</p>{import.meta.env.DEV && this.state.errorName && <p className="text-xs text-text-secondary mb-5">Development diagnostic: {this.state.errorName}</p>}<div className="flex flex-col sm:flex-row justify-center gap-3"><button type="button" className="btn-primary" onClick={this.handleRetry}>Try again</button><a href="/explore" className="btn-secondary">Browse deals</a></div></div></main>;
  }
}

export default AppErrorBoundary;
