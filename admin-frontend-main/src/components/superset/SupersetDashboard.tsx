import React, { useState, useEffect } from 'react';

interface SupersetDashboardProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

const SupersetDashboard: React.FC<SupersetDashboardProps> = ({
  url,
  title,
  description,
  className = '',
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');
  }, [url]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleIframeError = () => {
    const error = new Error(`Failed to load Superset dashboard: ${title}`);
    setIsLoading(false);
    setHasError(true);
    setErrorMessage(error.message);
    onError?.(error);
  };

  const retryLoad = () => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');
    
    const iframe = document.querySelector(`iframe[title="${title}"]`) as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  if (hasError) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
        <div className="flex flex-col items-center justify-center h-96 p-6">
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard Load Error</h3>
            <p className="text-sm text-gray-600 mb-4">{errorMessage}</p>
            <div className="space-y-2">
              <button
                onClick={retryLoad}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Retry Loading
              </button>
              <p className="text-xs text-gray-500">
                Make sure Superset is running and accessible at the configured URL
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {isLoading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-600">Loading {title}...</p>
            {description && (
              <p className="mt-1 text-xs text-gray-500">{description}</p>
            )}
          </div>
        </div>
      )}

      <div className={`${isLoading ? 'hidden' : 'block'}`}>
        <iframe
          src={url}
          className="w-full h-screen border-0 rounded-lg"
          title={title}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          style={{ minHeight: '800px' }}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
};

export default SupersetDashboard;