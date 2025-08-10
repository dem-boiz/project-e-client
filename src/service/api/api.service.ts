import type { Event } from '../../types/event';
import config from '../../utils/config';

// Base API configuration
const API_TIMEOUT = 10000; // 10 seconds

// User/Attendee type for API responses

// Create Event request type
interface CreateEventRequest {
  name: string;
  description?: string;
  location?: string;
  datetime: string;
  host_id: string
  //capacity?: number;
}

interface CreateAccountRequest {
  username: string;
  email: string;
  password: string;
}
interface CreateAccountResponse {
  company_name: string;
  created_at: string;
  email: string;
  host_number: number;
  id: string;
}


// Update Event request type
interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
}

interface RequestLoginResponse {
  access_token: string;
  token_type: string;
  email: string;
  user_id: string;
  name: string;
}

interface RequestLoginData {
  email: string;
  password: string;
}

// TODO: Refactor to use axios and have proper API error handling and propagation so that
// we can display the proper error message. Currently, the server being down during a
// sign in attempt results in the user being incorrectly told to check their credentials.

// Generic API request function with error handling 
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${config.API_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
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
  }

}

// Export individual functions for convenience
export const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = EventApiService;

export const {
  createAccount,
  requestLogin
} = UserApiService;

// Export types for use in components
export type {
  CreateEventRequest,
  UpdateEventRequest,
  CreateAccountResponse,
  CreateAccountRequest
};
