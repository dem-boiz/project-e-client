import config from '../../utils/config';
import { jwtDecode } from 'jwt-decode';

interface RefreshResponse {
  access_token: string;
  token_type: string;
}

export class TokenManager {
  private static instance: TokenManager;
  private currentAccessToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  private constructor() {}

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  public setToken(accessToken: string, exp?: number): void {
    this.currentAccessToken = accessToken;
    this.tokenExpiresAt = exp ? exp * 1000 : null;
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

  public async getUserFromToken(): Promise<{ id: string; name: string; email: string } | null> {
    if (!this.currentAccessToken) return null;
    
    try {
      console.log('👤 Fetching user data from /auth/me...');
      const response = await fetch(`${config.API_URL}/auth/me`, {
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
          this.clearToken(); // Clear invalid token
        } else {
          console.error('❌ Failed to fetch user data:', response.status);
        }
        return null;
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


  public clearToken(): void {
    this.currentAccessToken = null;
    this.tokenExpiresAt = null;
  }

  public shouldRefreshToken(): boolean {
    if (!this.tokenExpiresAt) return false;
    const fiveMinutes = 5 * 60 * 1000;
    return (this.tokenExpiresAt - Date.now()) < fiveMinutes;
  }


  public async refreshAccessToken(isInit: boolean = false): Promise<RefreshResponse | null> {
    try {
      console.log(`🔄 Making refresh request to: ${config.API_URL}/auth/refresh`);
      console.log(`🍪 Current document.cookie:`, document.cookie);
      console.log(`🌐 Current origin:`, window.location.origin);

      // How is the refresh token being set and sent?
      const response = await fetch(`${config.API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Include HttpOnly refresh token cookie
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`📡 Response status:`, response.status);
      console.log(`📡 Response headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        if (isInit) {
          console.log('❌ Initial token refresh failed during app load');
          return null;
        }
        console.log('❌ response.ok is not true. Refresh failed');
        throw new Error(`Refresh failed: ${response.status}`);
      }

      const data: RefreshResponse = await response.json();
      const decodedAccessToken = jwtDecode(data.access_token);
      
      console.log(`✅ Refresh successful, new token exp:`, new Date((decodedAccessToken.exp || 0) * 1000));

      // Note: if we want to refresh access token without needing the user to interact with the app,
      // but simply be on it, we can instead set a timeout here to refresh a few minutes before the token
      // expires, instead of checking before every api call.

      // Update both access and refresh tokens in memory
      this.setToken(data.access_token, decodedAccessToken.exp);
      return data;
    } catch (error) {
      console.error('💥 Refresh error:', error);
      this.clearToken();
      return null;
    }
  }

  public getAuthorizationHeader(): Record<string, string> {
    if (this.currentAccessToken) {
      return { 'Authorization': `Bearer ${this.currentAccessToken}` };
    }
    return {};
  }
}

export default TokenManager;
