import { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    console.error('Component stack:', errorInfo.componentStack);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  toggleDetails = () => {
    this.setState((prevState) => ({
      showDetails: !prevState.showDetails,
    }));
  };

  handleCopyError = async () => {
    const { error, errorInfo } = this.state;
    
    if (!error) return;

    const errorText = [
      '=== ERROR DETAILS ===',
      '',
      'Error:',
      error.toString(),
      '',
      ...(error.stack ? ['Stack Trace:', error.stack, ''] : []),
      ...(errorInfo?.componentStack ? ['Component Stack:', errorInfo.componentStack, ''] : []),
      '=== END OF ERROR DETAILS ===',
    ].join('\n');

    try {
      await navigator.clipboard.writeText(errorText);
      this.setState({ copied: true });
      setTimeout(() => {
        this.setState({ copied: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy error to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = errorText;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        this.setState({ copied: true });
        setTimeout(() => {
          this.setState({ copied: false });
        }, 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy also failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails } = this.state;

      return (
        <div className="error-boundary">
          <div className="error-boundary-container">
            <div className="error-boundary-header">
              <h1 className="error-boundary-title">⚠️ Bir Hata Oluştu</h1>
              <p className="error-boundary-message">
                Uygulamada beklenmeyen bir hata meydana geldi.
              </p>
            </div>

            {error && (
              <div className="error-boundary-content">
                <div className="error-boundary-main-error">
                  <strong>Hata:</strong>
                  <code className="error-boundary-error-message">
                    {error.toString()}
                  </code>
                </div>

                <button
                  className="error-boundary-toggle"
                  onClick={this.toggleDetails}
                >
                  {showDetails ? 'Detayları Gizle' : 'Detayları Göster'}
                </button>

                {showDetails && (
                  <div className="error-boundary-details">
                    {error.stack && (
                      <div className="error-boundary-section">
                        <strong>Stack Trace:</strong>
                        <pre className="error-boundary-stack">
                          {error.stack}
                        </pre>
                      </div>
                    )}

                    {errorInfo && errorInfo.componentStack && (
                      <div className="error-boundary-section">
                        <strong>Component Stack:</strong>
                        <pre className="error-boundary-stack">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="error-boundary-actions">
              <button
                className="error-boundary-button error-boundary-button-secondary"
                onClick={this.handleCopyError}
              >
                {this.state.copied ? '✓ Kopyalandı!' : 'Hata Bilgisini Kopyala'}
              </button>
              <button
                className="error-boundary-button error-boundary-button-primary"
                onClick={this.handleReload}
              >
                Sayfayı Yenile
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

