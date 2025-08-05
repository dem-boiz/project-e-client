import type { Event } from '../../types/event';

// Base API configuration
const API_BASE_URL = 'https://api.project-e.dev'; // Dummy API base URL
const API_TIMEOUT = 10000; // 10 seconds

// User/Attendee type for API responses
interface EventAttendee {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  role: 'host' | 'guest';
}

// API Response types
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// Create Event request type
interface CreateEventRequest {
  name: string;
  description?: string;
  location?: string;
  date: string;
  capacity?: number;
  isPrivate: boolean;
}

// Update Event request type
interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
}

// Generic API request function with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
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

// Get auth token (dummy implementation)
function getAuthToken(): string {
  // TODO: Implement actual token retrieval from storage/context
  return 'dummy-auth-token-123';
}

// Event API Service Functions
export const EventApiService = {
  /**
   * Get all events for the current user
   */
  async getAllEvents(): Promise<Event[]> {
    try {
      const response = await apiRequest<Event[]>('/api/events', {
        method: 'GET',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch events:', error);
      throw new Error('Failed to load events. Please try again.');
    }
  },

  /**
   * Get a single event by ID
   */
  async getEventById(eventId: string): Promise<Event> {
    try {
      const response = await apiRequest<Event>(`/api/events/${eventId}`, {
        method: 'GET',
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch event ${eventId}:`, error);
      throw new Error('Failed to load event details. Please try again.');
    }
  },

  /**
   * Create a new event
   */
  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    try {
      const response = await apiRequest<Event>('/api/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create event:', error);
      throw new Error('Failed to create event. Please check your data and try again.');
    }
  },

  /**
   * Update an existing event
   */
 async updateEvent(id: string, data: UpdateEventRequest): Promise<Event> {
    try {
      const response = await apiRequest<Event>(`/api/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to update event ${id}:`, error);
      throw new Error('Failed to update event. Please try again.');
    }
  },

  /**
   * Delete an event
   */
  async deleteEvent(eventId: string): Promise<void> {
    try {
      await apiRequest<void>(`/api/events/${eventId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to delete event ${eventId}:`, error);
      throw new Error('Failed to delete event. Please try again.');
    }
  },

  /**
   * Join an event using access code
   */
  async joinEvent(accessCode: string): Promise<Event> {
    try {
      const response = await apiRequest<Event>('/api/events/join', {
        method: 'POST',
        body: JSON.stringify({ accessCode }),
      });
      return response.data;
    } catch (error) {
      console.error('Failed to join event:', error);
      throw new Error('Invalid access code or event not found. Please check and try again.');
    }
  },

  /**
   * Leave an event
   */
  async leaveEvent(eventId: string): Promise<void> {
    try {
      await apiRequest<void>(`/api/events/${eventId}/leave`, {
        method: 'POST',
      });
    } catch (error) {
      console.error(`Failed to leave event ${eventId}:`, error);
      throw new Error('Failed to leave event. Please try again.');
    }
  },

  /**
   * Get events by status
   */
  async getEventsByStatus(status: 'upcoming' | 'ongoing' | 'past'): Promise<Event[]> {
    try {
      const response = await apiRequest<Event[]>(`/api/events?status=${status}`, {
        method: 'GET',
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch ${status} events:`, error);
      throw new Error(`Failed to load ${status} events. Please try again.`);
    }
  },

  /**
   * Generate event access code (for hosts)
   */
  async generateAccessCode(eventId: string): Promise<string> {
    try {
      const response = await apiRequest<{ accessCode: string }>(`/api/events/${eventId}/access-code`, {
        method: 'POST',
      });
      return response.data.accessCode;
    } catch (error) {
      console.error(`Failed to generate access code for event ${eventId}:`, error);
      throw new Error('Failed to generate access code. Please try again.');
    }
  },

  /**
   * Get event attendees (for hosts)
   */
  async getEventAttendees(eventId: string): Promise<EventAttendee[]> {
    try {
      const response = await apiRequest<EventAttendee[]>(`/api/events/${eventId}/attendees`, {
        method: 'GET',
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch attendees for event ${eventId}:`, error);
      throw new Error('Failed to load event attendees. Please try again.');
    }
  },
};

// Export individual functions for convenience
export const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  getEventsByStatus,
  generateAccessCode,
  getEventAttendees,
} = EventApiService;

// Export types for use in components
export type {
  CreateEventRequest,
  UpdateEventRequest,
  ApiResponse,
  ApiError,
  EventAttendee,
};
