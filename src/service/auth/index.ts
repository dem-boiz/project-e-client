import { AuthService, type AuthServiceCallbacks } from './AuthService';

// Global AuthService instance for dependency injection
let globalAuthService: AuthService | null = null;

export function createAuthService(callbacks?: AuthServiceCallbacks): AuthService {
  if (!globalAuthService) {
    globalAuthService = new AuthService(callbacks);
  } else if (callbacks) {
    // Update callbacks if provided
    globalAuthService.setCallbacks(callbacks);
  }
  return globalAuthService;
}

export function getAuthService(): AuthService {
  if (!globalAuthService) {
    throw new Error('AuthService not initialized. Call createAuthService() first.');
  }
  return globalAuthService;
}

// Export types and classes
export * from './AuthService';
export { AuthProvider } from './AuthProvider';
