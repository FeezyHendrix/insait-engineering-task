import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { embedDashboard } from '@superset-ui/embedded-sdk';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/elements/radix/tab';
import { getDirFromLang } from '@/utils';
import { useAppSelector } from '@/hook/useReduxHooks';
import { useSuperset } from '@/hooks/useSuperset';
import type { SupersetDashboard } from '@/types/network';

interface EmbeddedDashboardProps {
  dashboard: SupersetDashboard;
  embeddedId: string;
  isActive: boolean;
  hasGuestToken: boolean;
  onEmbed: (dashboardId: string, containerId: string) => Promise<void>;
}

const EmbeddedDashboard: React.FC<EmbeddedDashboardProps> = ({
  dashboard,
  embeddedId,
  isActive,
  hasGuestToken,
  onEmbed
}) => {
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [hasEmbedded, setHasEmbedded] = useState(false);
  const containerId = `superset-container-${dashboard.id}`;

  useEffect(() => {
    // Reset embedded state when tab becomes inactive
    if (!isActive && hasEmbedded) {
      setHasEmbedded(false);
    }
  }, [isActive, hasEmbedded]);

  useEffect(() => {
    // Only embed when dashboard is active, has embedded ID, and guest token is ready
    if (isActive && embeddedId && hasGuestToken && !isEmbedding && !hasEmbedded) {
      setIsEmbedding(true);
      
      // Add a small delay before embedding to prevent rate limiting
      const embedWithDelay = async () => {
        // Clear the container before re-embedding
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = '';
        }
        
        await new Promise(resolve => setTimeout(resolve, 300));
        return onEmbed(dashboard.id, containerId);
      };
      
      embedWithDelay()
        .then(() => {
          setHasEmbedded(true);
        })
        .catch((error) => {
          console.error(`Failed to embed dashboard ${dashboard.id}:`, error);
          setHasEmbedded(false);
        })
        .finally(() => {
          setIsEmbedding(false);
        });
    }
  }, [isActive, embeddedId, hasGuestToken, dashboard.id, containerId, onEmbed, isEmbedding, hasEmbedded]);

  return (
    <TabsContent 
      key={dashboard.id} 
      value={dashboard.id} 
      className="mt-3 max-h-page-scroll-230 px-5"
    >
      {/* Dashboard Description */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {dashboard.dashboard_title}
        </h3>
        <p className="text-sm text-gray-600">
          Dashboard ID: {dashboard.id} | Published: {dashboard.published ? 'Yes' : 'No'}
          {embeddedId && (
            <span className="ml-2">| Embedded ID: {embeddedId}</span>
          )}
        </p>
      </div>

      {/* Loading State */}
      {isEmbedding && (
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-sm text-gray-600">Loading {dashboard.dashboard_title}...</p>
          </div>
        </div>
      )}

      {/* Dashboard Container */}
      <div
        id={containerId}
        className={`w-full min-h-[800px] h-[800px] rounded-lg border border-gray-200 bg-white overflow-hidden ${
          isEmbedding ? 'hidden' : 'block'
        }`}
        style={{ 
          minHeight: '800px',
          height: '800px',
          position: 'relative'
        }}
      />

      {/* Info */}
      <div className="mt-4 text-xs text-gray-500">
        <p>
          Dashboard loaded from Superset at{' '}
          <code className="bg-gray-100 px-1 rounded">
            {import.meta.env.VITE_SUPERSET_BASE_URL || 'http://localhost:8088'}
          </code>
        </p>
      </div>
    </TabsContent>
  );
};

const ErrorDisplay: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 mx-6">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">Error Loading Dashboards</h3>
        <p className="text-sm text-red-700 mt-1">{error}</p>
        <button
          onClick={onRetry}
          className="mt-2 text-sm text-red-800 underline hover:text-red-900"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

const LoadingDisplay: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-6">
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-sm text-gray-600">Loading dashboards...</p>
      </div>
    </div>
  </div>
);

// Create a global token cache to prevent multiple API calls
const globalGuestTokenCache = new Map<string, string>();
const tokenFetchingInProgress = new Set<string>();
const configsFetched = new Set<string>();

const SupersetAnalytics: React.FC = () => {
  const { t } = useTranslation();
  const language = useAppSelector(state => state.companyConfig.language);
  const [selectedDashboard, setSelectedDashboard] = useState<string>('');
  const [embeddedConfigs, setEmbeddedConfigs] = useState<Record<string, string>>({});
  const [guestTokens, setGuestTokens] = useState<Record<string, string>>({});

  // Add CSS to ensure iframes fill their containers
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Ensure Superset iframes fill their containers */
      [id^="superset-container-"] iframe {
        width: 100% !important;
        min-height: 1400px !important;
        border: none !important;
      }
      
      [id^="superset-container-"] {
        width: 100% !important;
        height: 100% !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  const {
    dashboards,
    isLoading,
    error,
    getEmbeddedConfig,
    createGuestToken,
    refreshData,
    clearError
  } = useSuperset();

  // Limit to 4 tabs for UI consistency
  const displayDashboards = dashboards.slice(0, 4);

  // Set initial selected dashboard
  useEffect(() => {
    if (displayDashboards.length > 0 && !selectedDashboard) {
      setSelectedDashboard(displayDashboards[0].id);
    }
  }, [displayDashboards, selectedDashboard]);

  // Fetch embedded configs and guest tokens for each dashboard
  useEffect(() => {
    const fetchConfigsAndTokens = async () => {
      if (displayDashboards.length === 0) return;
      
      // Create a unique key for this set of dashboards
      const dashboardIds = displayDashboards.map(d => d.id).sort().join(',');
      if (configsFetched.has(dashboardIds)) {
        return;
      }
      
      configsFetched.add(dashboardIds);

      try {
        // Helper function to add delay between requests
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        // Fetch embedded configs with delay
        const configs: Record<string, string> = {};
        for (let i = 0; i < displayDashboards.length; i++) {
          const dashboard = displayDashboards[i];
          
          if (i > 0) {
            await delay(200); // 200ms delay between requests
          }
          
          const config = await getEmbeddedConfig(dashboard.id);
          if (config) {
            configs[dashboard.id] = config.uuid;
          } else {
            console.warn(`Failed to get embedded config for dashboard ${dashboard.id}`);
            configsFetched.delete(dashboardIds); // Clear flag to allow retry
            return;
          }
        }
        setEmbeddedConfigs(configs);

        // Create guest tokens for each dashboard with delay (only if not already created)
        const tokens: Record<string, string> = {};
        for (let i = 0; i < displayDashboards.length; i++) {
          const dashboard = displayDashboards[i];
          
          if (i > 0) {
            await delay(200); // 200ms delay between token requests
          }
          
          // Check if token is already cached or being fetched
          if (globalGuestTokenCache.has(dashboard.id)) {
            tokens[dashboard.id] = globalGuestTokenCache.get(dashboard.id)!;
            continue;
          }
          
          if (tokenFetchingInProgress.has(dashboard.id)) {
            continue;
          }

          tokenFetchingInProgress.add(dashboard.id);
          
          try {
            const token = await createGuestToken(dashboard.id);
            if (token) {
              tokens[dashboard.id] = token;
              globalGuestTokenCache.set(dashboard.id, token);
            } else {
              configsFetched.delete(dashboardIds); // Clear flag to allow retry
              return;
            }
          } finally {
            tokenFetchingInProgress.delete(dashboard.id);
          }
        }
        setGuestTokens(tokens);
      } catch (error) {
        configsFetched.delete(dashboardIds); // Clear flag to allow retry
      }
    };

    if (displayDashboards.length > 0 && Object.keys(guestTokens).length === 0) {
      fetchConfigsAndTokens();
    }
  }, [displayDashboards]);

  // Handle dashboard embedding with token refresh on authentication errors
  const handleDashboardEmbed = async (dashboardId: string, containerId: string) => {
    try {
      const embeddedId = embeddedConfigs[dashboardId];
      if (!embeddedId) {
        throw new Error(`No embedded ID found for dashboard ${dashboardId}`);
      }

      const guestToken = guestTokens[dashboardId];
      if (!guestToken) {
        throw new Error(`No guest token available for dashboard ${dashboardId}`);
      }

      // Function to refresh guest token when it expires
      const refreshGuestToken = async (dashboardId: string): Promise<string> => {
        try {
          // Clear expired token from caches
          globalGuestTokenCache.delete(dashboardId);
          setGuestTokens(prev => {
            const updated = { ...prev };
            delete updated[dashboardId];
            return updated;
          });

          // Create new guest token
          const newToken = await createGuestToken(dashboardId);
          if (newToken) {
            globalGuestTokenCache.set(dashboardId, newToken);
            setGuestTokens(prev => ({ ...prev, [dashboardId]: newToken }));
            return newToken;
          }
          throw new Error('Failed to refresh guest token');
        } catch (error) {
          console.error(`Failed to refresh guest token for dashboard ${dashboardId}:`, error);
          throw error;
        }
      };

      // Enhanced fetch function that handles token expiration
      const fetchGuestTokenForEmbed = async (): Promise<string> => {
        // First try current token
        const currentToken = guestTokens[dashboardId] || globalGuestTokenCache.get(dashboardId);
        if (currentToken) {
          return currentToken;
        }

        // If no token available, refresh it
        return await refreshGuestToken(dashboardId);
      };

      await embedDashboard({
        id: embeddedId, // Use embedded UUID instead of dashboard ID
        supersetDomain: import.meta.env.VITE_SUPERSET_BASE_URL || 'http://localhost:8088',
        mountPoint: document.getElementById(containerId)!,
        fetchGuestToken: fetchGuestTokenForEmbed,
        dashboardUiConfig: {
          hideTitle: false,
          hideTab: false,
          hideChartControls: false,
          filters: {
            expanded: false,
          },
        },
        debug: false,
      });
    } catch (error) {
      console.error(`Error embedding dashboard ${dashboardId}:`, error);
      
      // Check if it's an authentication error and try to refresh token
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('authentication') || errorMessage.includes('token') || errorMessage.includes('401')) {
        console.log(`Authentication error detected for dashboard ${dashboardId}, attempting token refresh...`);
        try {
          // Clear the container and show loading state
          const container = document.getElementById(containerId);
          if (container) {
            container.innerHTML = '<div class="flex items-center justify-center h-96"><div class="text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div><p class="text-sm text-gray-600">Refreshing authentication...</p></div></div>';
          }
          
          // Wait a moment then retry embedding
          await new Promise(resolve => setTimeout(resolve, 1000));
          await handleDashboardEmbed(dashboardId, containerId);
        } catch (retryError) {
          console.error(`Failed to retry embedding after token refresh for dashboard ${dashboardId}:`, retryError);
          throw retryError;
        }
      } else {
        throw error;
      }
    }
  };

  const handleRetry = () => {
    clearError();
    refreshData();
  };

  return (
    <section className='flex flex-1 flex-col flex-wrap'>
      {/* Header */}
      <div className="mb-4 px-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('menu.supersetAnalytics', 'Superset Analytics')}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Interactive dashboards powered by Apache Superset for deep conversation analysis
        </p>
      </div>

      {/* Error State */}
      {error && <ErrorDisplay error={error} onRetry={handleRetry} />}

      {/* Loading State */}
      {isLoading && displayDashboards.length === 0 && <LoadingDisplay />}

      {/* Dashboard Tabs */}
      {displayDashboards.length > 0 && (
        <Tabs 
          dir={getDirFromLang(language)} 
          value={selectedDashboard} 
          onValueChange={setSelectedDashboard} 
          className="w-full mt-2 flex-1"
        >
          <TabsList 
            className={`grid bg-gray-200 rounded-md ms-6 p-1.5 max-w-2xl`}
            style={{ gridTemplateColumns: `repeat(${displayDashboards.length}, 1fr)` }}
          >
            {displayDashboards.map((dashboard) => (
              <TabsTrigger
                key={dashboard.id}
                value={dashboard.id}
                className="analytics-tab-trigger"
              >
                {dashboard.dashboard_title}
              </TabsTrigger>
            ))}
          </TabsList>

          {displayDashboards.map((dashboard) => (
            <EmbeddedDashboard
              key={dashboard.id}
              dashboard={dashboard}
              embeddedId={embeddedConfigs[dashboard.id] || ''}
              isActive={selectedDashboard === dashboard.id}
              hasGuestToken={!!guestTokens[dashboard.id]}
              onEmbed={handleDashboardEmbed}
            />
          ))}
        </Tabs>
      )}
    </section>
  );
};

export default SupersetAnalytics;