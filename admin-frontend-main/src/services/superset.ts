import { axiosInstance } from '@/utils/axios';
import { handleNetworkError } from '@/utils';
import type { 
  SupersetAuthRequest, 
  SupersetDashboard, 
  SupersetEmbeddedConfig} from '@/types/network';

class SupersetService {
  private baseUrl: string;
  private credentials: {
    username: string;
    password: string;
  };

  constructor() {
    this.baseUrl = import.meta.env.VITE_SUPERSET_BASE_URL || 'http://localhost:8088';
    this.credentials = {
      username: import.meta.env.VITE_SUPERSET_USERNAME || 'admin',
      password: import.meta.env.VITE_SUPERSET_PASSWORD || 'admin'
    };
  }

  /**
   * Authenticate with Superset and get access token
   */
  async authenticate(): Promise<string> {
    try {
      const payload: SupersetAuthRequest = {
        username: this.credentials.username,
        password: this.credentials.password,
        provider: 'db',
        refresh: true
      };

      const response = await axiosInstance.post(`${this.baseUrl}/api/v1/security/login`, payload);
      return response.data.access_token;
    } catch (error) {
      const message = handleNetworkError(error);
      throw new Error(`Superset authentication failed: ${message}`);
    }
  }

  /**
   * Fetch all dashboards from Superset
   */
  async getDashboards(accessToken: string): Promise<SupersetDashboard[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/api/v1/dashboard/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data.result || [];
    } catch (error) {
      const message = handleNetworkError(error);
      throw new Error(`Failed to fetch dashboards: ${message}`);
    }
  }

  /**
   * Get embedded dashboard configuration
   */
  async getEmbeddedConfig(dashboardId: string, accessToken: string): Promise<SupersetEmbeddedConfig> {
    try {
      const response = await axiosInstance.get(
        `${this.baseUrl}/api/v1/dashboard/${dashboardId}/embedded`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.result;
    } catch (error) {
      const message = handleNetworkError(error);
      throw new Error(`Failed to get embedded config for dashboard ${dashboardId}: ${message}`);
    }
  }

  /**
   * Create guest token for dashboard embedding
   */
  async createGuestToken(dashboardId: string, accessToken: string): Promise<string> {
    try {
      const payload = {
        user: {
          username: 'guest',
          first_name: 'Guest',
          last_name: 'User'
        },
        resources: [{
          type: 'dashboard',
          id: `${dashboardId}`,
        }],
        rls: []
      };

      const response = await axiosInstance.post(
        `${this.baseUrl}/api/v1/security/guest_token/`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.token;
    } catch (error: unknown) {
      console.error('Guest token creation error:', {
        error,
        response: error && typeof error === 'object' && 'response' in error ? (error as {response?: {data?: unknown}}).response?.data : undefined,
        status: error && typeof error === 'object' && 'response' in error ? (error as {response?: {status?: unknown}}).response?.status : undefined,
        dashboardId
      });
      const message = handleNetworkError(error);
      throw new Error(`Failed to create guest token for dashboard ${dashboardId}: ${message}`);
    }
  }

}

export const supersetService = new SupersetService();