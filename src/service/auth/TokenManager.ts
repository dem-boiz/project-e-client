import config from '../../utils/config';

interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export class TokenManager {
  private static instance: TokenManager;
  private currentAccessToken: string | null = null;
  private currentRefreshToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  private constructor() {}

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  public setTokens(accessToken: string, refreshToken: string, expiresIn?: number): void {
    this.currentAccessToken = accessToken;
    this.currentRefreshToken = refreshToken;
    
    if (expiresIn) {
      this.tokenExpiresAt = Date.now() + (expiresIn * 1000);
    }
  }

  public getAccessToken(): string | null {
    return this.currentAccessToken;
  }

  public getRefreshToken(): string | null {
    return this.currentRefreshToken;
  }

  public clearTokens(): void {
    this.currentAccessToken = null;
    this.currentRefreshToken = null;
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
      
      // Update both access and refresh tokens in memory
      this.setTokens(data.access_token, data.refresh_token);
      
      return data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
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
