import { useState, useEffect } from 'react';
import { supersetService } from '@/services/superset';
import type { SupersetDashboard, SupersetEmbeddedConfig } from '@/types/network';

export const useSuperset = () => {
  const [dashboards, setDashboards] = useState<SupersetDashboard[]>([]);
  const [embeddedConfigs, setEmbeddedConfigs] = useState<Record<string, SupersetEmbeddedConfig>>({});
  const [accessToken, setAccessToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const authenticate = async () => {
    try {
      setIsLoading(true);
      setError('');
      const token = await supersetService.authenticate();
      setAccessToken(token);
      return token;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboards = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      let token = accessToken;
      if (!token) {
        token = await authenticate();
      }
      
      const dashboardsData = await supersetService.getDashboards(token);
      const publishedDashboards = dashboardsData.filter(dashboard => dashboard.published);
      setDashboards(publishedDashboards);
      return publishedDashboards;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboards';
      setError(errorMessage);
      setDashboards([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getEmbeddedConfig = async (dashboardId: string) => {
    try {
      // Return cached config if available
      if (embeddedConfigs[dashboardId]) {
        return embeddedConfigs[dashboardId];
      }

      let token = accessToken;
      if (!token) {
        token = await authenticate();
      }

      const embeddedConfig = await supersetService.getEmbeddedConfig(dashboardId, token);
      setEmbeddedConfigs(prev => ({ ...prev, [dashboardId]: embeddedConfig }));
      return embeddedConfig;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to get embedded config for dashboard ${dashboardId}`;
      setError(errorMessage);
      return null;
    }
  };

  const createGuestToken = async (dashboardId: string) => {
    try {
      let token = accessToken;
      if (!token) {
        token = await authenticate();
      }

      const guestToken = await supersetService.createGuestToken(dashboardId, token);
      return guestToken;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to create guest token for dashboard ${dashboardId}`;
      setError(errorMessage);
      return null;
    }
  };

  const refreshData = async () => {
    try {
      await authenticate();
      await fetchDashboards();
    } catch (error) {
      // Error is already handled in individual methods
    }
  };

  const clearError = () => {
    setError('');
  };

  // Auto-fetch dashboards on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        await authenticate();
        await fetchDashboards();
      } catch (error) {
        // Error is already handled in individual methods
      }
    };
    
    initializeData();
  }, []);

  return {
    dashboards,
    embeddedConfigs,
    accessToken,
    isLoading,
    error,
    authenticate,
    fetchDashboards,
    getEmbeddedConfig,
    createGuestToken,
    refreshData,
    clearError
  };
};