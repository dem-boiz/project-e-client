import type { Event } from '../../types/event';
import type { CreateEventRequest, UpdateEventRequest, CreateAccountRequest, CreateAccountResponse, RequestLoginData, RequestLoginResponse } from '../../types/network.types';
import config from '../../utils/config';
import AuthManager from '../auth/TokenManager';
// Base API configuration

const authManager = AuthManager.getInstance();

// Generic API request function with error handling 
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.API_TIMEOUT);

  // Check if we need to refresh token before making the request
  if (authManager.shouldRefreshToken() && endpoint !== '/auth/refresh') {
    const refreshResult = await authManager.refreshAccessToken();
    if (!refreshResult) {
      // Refresh failed, let the auth context handle logout
      throw new Error('Session expired. Please sign in again.');
    }
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
      ...authManager.getAuthorizationHeader(),
    };

    const response = await fetch(`/api${endpoint}`, {
      ...options,
      signal: controller.signal,
      credentials: 'include', // Include cookies for refresh token
      headers,
    });

    clearTimeout(timeoutId);

    // Handle 401 - try refresh once
    if (response.status === 401 && endpoint !== '/auth/refresh') {
      const refreshResult = await authManager.refreshAccessToken();
      if (refreshResult) {
        // Retry the original request with new token
        const retryHeaders = {
          ...headers,
          ...authManager.getAuthorizationHeader(),
        };
        
        const retryResponse = await fetch(`/${endpoint}`, {
          ...options,
          credentials: 'include',
          headers: retryHeaders,
        });
        
        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
        }
        
        if (retryResponse.status === 204) {
          return new Response(null, { status: 204 });
        }
        return await retryResponse.json();
      } else {
        // Refresh failed
        throw new Error('Session expired. Please sign in again.');
      }
    }

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

// Event API Service Functions
export const EventApiService = {
  /**
   * Get all events for the current user
   */
  async getAllEvents(): Promise<Event[]> {
    try {
      console.log('getting all events ');
      const response = await apiRequest('/events', {
        method: 'GET',
      });
      console.log('Got all events:', response);
      return response as unknown as Event[];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to load events. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },

  /**
   * Get a single event by ID
   */
  async getEventById(eventId: string): Promise<Event> {
    try {
      const response = await apiRequest(`/events/${eventId}`, {
        method: 'GET',
      });
      return response as unknown as Event;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to fetch event. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },

  /**
   * Create a new event
   */
  async createEvent(eventData: CreateEventRequest, accessToken?: string): Promise<Event> {
    try {
      const response = await apiRequest('/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response as unknown as Event;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to create event. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },

  /**
   * Update an existing event
   */
 async updateEvent(id: string, data: UpdateEventRequest, accessToken?: string): Promise<Event> {
    try {
      const response = await apiRequest(`/events/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response as unknown as Event;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to update event. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },

  /**
   * Delete an event
   */
  async deleteEvent(eventId: string, accessToken?: string): Promise<void> {
    try {
      await apiRequest(`/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to delete event. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },

  async inviteGuest(eventId: string, accessToken?: string,  guestEmail?: string,  label?: string): Promise<string> {
    try {
      const response = await apiRequest(`/events/${eventId}/invite`, {
        method: 'POST',
        body: JSON.stringify({ email: guestEmail, label }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Invite response:::')
      console.log(response);
      return response as unknown as string
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to invite guest. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },

};



export const UserApiService = {
  async createAccount(data: CreateAccountRequest): Promise<CreateAccountResponse> {
    try {
      console.log('Creating account:', data);
      const response = await apiRequest('/hosts/', {
        method: 'POST',
        body: JSON.stringify({ company_name: data.username, email: data.email, password: data.password, created_at: new Date().toISOString() }),
      });
      console.log('Account created successfully:', response);
      return response as unknown as CreateAccountResponse;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to create account. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },

  async requestLogin(data: RequestLoginData): Promise<RequestLoginResponse> {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }) as unknown as RequestLoginResponse;
      return response as unknown as RequestLoginResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to log in. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },

  async requestLogout(): Promise<void> {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to log out. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  }





}

// Export individual functions for convenience
export const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  inviteGuest
} = EventApiService;

export const {
  createAccount,
  requestLogin,
  requestLogout
} = UserApiService;

// Export types for use in components
export type {
  CreateEventRequest,
  UpdateEventRequest,
  CreateAccountResponse,
  CreateAccountRequest
};
