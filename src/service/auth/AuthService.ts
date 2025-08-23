import { jwtDecode } from 'jwt-decode';
import type { RequestLoginData, RequestLoginResponse, User } from '../../types/network.types';
import config from '../../utils/config';

export interface UserData {
  id: string;
  name: string;
  email: string;
}

export interface RefreshResponse {
  access_token: string;
  token_type: string;
  csrf_token?: string;
}

export interface AuthServiceCallbacks {
  onLogout?: () => void;
  onLogin?: (user: User) => void;
  onTokenRefreshed?: (userData: UserData) => void;
  onAuthError?: (error: string) => void;
}

export class AuthService {
  private currentAccessToken: string | null = null;
  private csrfToken: string = '';
  private tokenExpiresAt: number | null = null;
  private callbacks: AuthServiceCallbacks = {};


  constructor(callbacks?: AuthServiceCallbacks) {
    this.callbacks = callbacks || {};
  }

  public setCallbacks(callbacks: AuthServiceCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  public setToken(accessToken: string, exp?: number): void {
    this.currentAccessToken = accessToken;
    this.tokenExpiresAt = exp ? exp * 1000 : null;
  }

  public setCsrfToken(csrfToken: string): void {
    this.csrfToken = csrfToken;
    console.log('CSRF token set in AuthService:', this.csrfToken);
  }

  public getCsrfToken(): string {
    return this.csrfToken;
  }

  public getAccessToken(): string | null {
    return this.currentAccessToken;
  }

  public getUserIdFromToken(): string | null {
    if (!this.currentAccessToken) return null;
    
    try {
      const decoded = jwtDecode(this.currentAccessToken) as { sub?: string };
      return decoded.sub || null;
    } catch (error) {
      console.error('Failed to decode access token for user ID:', error);
      return null;
    }
  }

  public clearTokens(): void {
    this.currentAccessToken = null;
    this.tokenExpiresAt = null;
    this.csrfToken = '';
  }

  public shouldRefreshToken(): boolean {
    if (!this.tokenExpiresAt) return false;
    const threeMinutes = 3 * 60 * 1000;
    return (this.tokenExpiresAt - Date.now()) < threeMinutes;
  }

  public getAuthHeaders(includeAccessToken: boolean = true, includeCsrfToken: boolean = false): Record<string, string> {
    const headers: Record<string, string> = {};

    if (includeAccessToken && this.currentAccessToken) {
      headers['Authorization'] = `Bearer ${this.currentAccessToken}`;
    }

    if (includeCsrfToken && this.csrfToken) {
      headers['X-CSRF-Token'] = this.csrfToken;
    }
    
    return headers;
  }

  public async getUserFromToken(): Promise<UserData | null> {
    if (!this.currentAccessToken) return null;
    
    try {
      console.log('👤 Fetching user data from /auth/me...');
      const response = await fetch(`/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${this.currentAccessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('❌ Access token is invalid or expired');
          this.handleAuthError('Access token invalid or expired');
          return null;
        } else {
          console.error('❌ Failed to fetch user data:', response.status);
          return null;
        }
      }

      const userData = await response.json();
      console.log('✅ User data fetched successfully:', userData);
      
      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      };
    } catch (error) {
      console.error('💥 Failed to fetch user data from /auth/me:', error);
      return null;
    }
  } 

  public async refreshAccessToken(isInit: boolean = false): Promise<RefreshResponse | null> {
    try {
      console.log('🔄 Refreshing access token...');
      console.log('sending csrfToken:', this.csrfToken);
      
      const response = await fetch(`/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.csrfToken
        },
      });

      console.log(`📡 Response status:`, response.status);

      if (!response.ok) {
        if (isInit) {
          console.log('❌ Initial token refresh failed during app load');
          return null;
        }
        console.log('❌ Token refresh failed');
        this.handleAuthError('Token refresh failed');
        return null;
      }

      const data: RefreshResponse = await response.json();
      const decodedAccessToken = jwtDecode(data.access_token);
      
      console.log(`✅ Refresh successful, new token exp:`, new Date((decodedAccessToken.exp || 0) * 1000));

      // Update tokens
      this.setToken(data.access_token, decodedAccessToken.exp);
      if (data.csrf_token) {
        this.setCsrfToken(data.csrf_token);
      }

      // Notify React layer of successful refresh
      if (this.callbacks.onTokenRefreshed) {
        const userData = await this.getUserFromToken();
        if (userData) {
          this.callbacks.onTokenRefreshed(userData);
        }
      }

      return data;
    } catch (error) {
      console.error('💥 Refresh error:', error);
      this.clearTokens();
      this.handleAuthError('Token refresh failed');
      return null;
    }
  }


  async login(data: RequestLoginData): Promise<RequestLoginResponse> {
    try {
      console.log('Attempting login...')
      const response = await this.apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }) as unknown as RequestLoginResponse;

      const decodedAccessToken = jwtDecode(response.access_token);
      this.setToken(response.access_token, decodedAccessToken.exp);

      if (this.callbacks.onLogin) {
        this.callbacks.onLogin({
          email: response.email,
          name: response.name,
          id: response.user_id,
          isAuthenticated: true
        });
      }

      console.log('Successful login')
      return response as unknown as RequestLoginResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to log in. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('Attempting logout...');
      await this.apiRequest('/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': this.csrfToken
        },
      });
      this.clearTokens();
      if (this.callbacks.onLogout) {
        this.callbacks.onLogout();
      }
      console.log('Successful logout');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to log out. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  }

  private handleAuthError(error: string): void {
    this.clearTokens();
    if (this.callbacks.onAuthError) {
      this.callbacks.onAuthError(error);
    }
    if (this.callbacks.onLogout) {
      this.callbacks.onLogout();
    }
  }

  // Method for API service to ensure token is fresh before requests
  public async ensureValidToken(): Promise<boolean> {
    if (!this.currentAccessToken) {
      return false;
    }

    if (this.shouldRefreshToken()) {
      const refreshResult = await this.refreshAccessToken();
      return refreshResult !== null;
    }

    return true;
  }

  private async apiRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.API_TIMEOUT);
  

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };
  
      const response = await fetch(`/api/auth${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers,
      });
  
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error data:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
  
      if (response.status === 204) {
        return new Response(null, { status: 204 }); // No content response
      }
      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw error;
      }
      
      throw new Error('An unexpected error occurred');
    }
  }

}
