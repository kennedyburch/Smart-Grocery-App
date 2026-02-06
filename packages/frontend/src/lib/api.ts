const API_BASE_URL = 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

class ApiClient {
  private getAuthToken(): string | null {
    // This will be properly integrated with Zustand store
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      return state.accessToken;
    }
    return null;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requireAuth = false, headers = {}, ...restOptions } = options;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...restOptions,
    };

    if (requireAuth) {
      const token = this.getAuthToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Convenience methods
  get<T>(endpoint: string, requireAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', requireAuth });
  }

  post<T>(endpoint: string, data?: any, requireAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      requireAuth,
    });
  }

  put<T>(endpoint: string, data?: any, requireAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      requireAuth,
    });
  }

  delete<T>(endpoint: string, requireAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', requireAuth });
  }
}

export const apiClient = new ApiClient();
