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


  public clearToken(): void {
    this.currentAccessToken = null;
    this.tokenExpiresAt = null;
  }

  public shouldRefreshToken(): boolean {
    if (!this.tokenExpiresAt) return false;
    const fiveMinutes = 5 * 60 * 1000;
    return (this.tokenExpiresAt - Date.now()) < fiveMinutes;
  }


  public async refreshAccessToken(): Promise<RefreshResponse | null> {
    try {

      // How is the refresh token being set and sent?
      const response = await fetch(`${config.API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Include HttpOnly refresh token cookie
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Refresh failed: ${response.status}`);
      }

      const data: RefreshResponse = await response.json();
      const decodedAccessToken = jwtDecode(data.access_token);


      // Note: if we want to refresh access token without needing the user to interact with the app,
      // but simply be on it, we can instead set a timeout here to refresh a few minutes before the token
      // expires, instead of checking before every api call.

      // Update both access and refresh tokens in memory
      this.setToken(data.access_token, decodedAccessToken.exp);
      return data;
    } catch (error) {
      console.error('Token refresh failed:', error);
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
