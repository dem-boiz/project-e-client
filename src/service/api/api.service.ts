import type { Vendor } from '../../features/my-events/components/EventDefaultView';
import type { Guest } from '../../features/my-events/components/ManageGuestsView/ManageGuestsView';
import type { Event } from '../../types/event';
import type { CreateEventRequest, CreateInviteResponse, UpdateEventRequest, User, VendorDescriptionUpdate, VendorImageCreation, VendorImageData } from '../../types/network.types';
import config from '../../utils/config';
import { getAuthService } from '../auth/index';



// Lazy load auth service to avoid initialization order issues
function getAuth() {
  try {
    return getAuthService();
  } catch {
    // If AuthService not initialized yet, throw a more helpful error
    throw new Error('Authentication not initialized. Please ensure the app is properly loaded.');
  }
}

// Generic API request function with error handling 
async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  useAuth = true,
  useDeviceAuth = false

): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.API_TIMEOUT);

  // Ensure we have a valid token before making the request
  const authService = getAuth();
  const hasValidToken = await authService.ensureValidToken();
  if (
    useAuth &&
    !hasValidToken &&
    endpoint !== '/auth/refresh' &&
    endpoint !== '/auth/login' &&
    endpoint !== '/auth/register'
  ) {
    throw new Error('Session expired. Please sign in again.');
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
      ...authService.getAuthHeaders(),
    };

    const response = await fetch(`/api${endpoint}`, {
      ...options,
      signal: controller.signal,
      credentials: useAuth || useDeviceAuth ? 'include' : 'omit', // Include cookies for refresh token
      headers: useAuth ? headers : (options.headers as Record<string, string> | undefined),
    });

    clearTimeout(timeoutId);

    // Handle 401 - try refresh once
    if (response.status === 401 && endpoint !== '/auth/refresh') {
      const authService = getAuth();
      const hasValidToken = await authService.ensureValidToken();
      if (hasValidToken) {
        // Retry the original request with new token
        const retryHeaders = {
          ...headers,
          ...authService.getAuthHeaders(),
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
  async getAllEvents(isAuthenticated: boolean): Promise<Event[]> {
    try {
      console.log('getting all events ');
      const response = await apiRequest('/events', {
        method: 'GET',
      }, isAuthenticated, true);
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
  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    try {
      const accessToken = getAuth().getAccessToken();
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
 async updateEvent(id: string, data: UpdateEventRequest): Promise<Event> {
    try {
      const accessToken = getAuth().getAccessToken();
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


  async revokePendingInvite(eventId: string, inviteId: string): Promise<void> {
    try {
      const accessToken = getAuth().getAccessToken();
      await apiRequest(`/events/${eventId}/invites/pending/${inviteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to revoke pending invite. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },


  async revokeAccess(eventId: string, guestId: string, type: string): Promise<void> {
    try {
      await apiRequest(`/events/${eventId}/guests/${guestId}?type=${type}`, {
        method: 'DELETE',
      }, true, false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to revoke guest access. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },


  /**
   * Delete an event
   */
  async deleteEvent(eventId: string): Promise<void> {
    try {
      const accessToken = getAuth().getAccessToken();
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

  async inviteGuest(eventId: string, guestEmail?: string,  label?: string): Promise<CreateInviteResponse> {
    try {
      const response = await apiRequest(`/events/${eventId}/invite`, {
        method: 'POST',
        body: JSON.stringify({ email: guestEmail, label, access_type: 'guest', delivery_method: 'email' }),
      }, true, false);
      return response as unknown as CreateInviteResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to invite guest. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },


  async inviteVendor(eventId: string, vendorEmail?: string,  label?: string): Promise<CreateInviteResponse> {
    try {
      const response = await apiRequest(`/events/${eventId}/invite`, {
        method: 'POST',
        body: JSON.stringify({ email: vendorEmail, label, access_type: 'vendor', delivery_method: 'email' }),

      }, true, false);
      return response as unknown as CreateInviteResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to invite guest. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },

  async getInviteLink(eventId: string, accessType: string): Promise<CreateInviteResponse> {
    try {
      const accessToken = getAuth().getAccessToken();
      const response = await apiRequest(`/events/${eventId}/invite`, {
        method: 'POST',
        body: JSON.stringify({ access_type: accessType, delivery_method: 'link', label: `invite-${eventId.substring(0, 8)}` }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('get invite link response:::')
      console.log(response);
      return response as unknown as CreateInviteResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to invite guest. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },

  async getEventGuests(eventId: string): Promise<User[]> {
    try {
      const response = await apiRequest(`/events/${eventId}/guests`, {
        method: 'GET'
      }, true, false);
      return response as unknown as User[];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to fetch current guests. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },

  async getEventVendors(eventId: string): Promise<User[]> {
    try {
      const response = await apiRequest(`/events/${eventId}/vendors`, {
        method: 'GET'
      }, true, false);
      return response as unknown as User[];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to fetch event vendors. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },

  async getPendingInvites(eventId: string): Promise<Guest[]> {
    try {
      const accessToken = getAuth().getAccessToken();
      const response = await apiRequest(`/events/${eventId}/invites/pending`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response as unknown as Guest[];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to fetch pending invites. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },

  async updatePendingInvite(eventId: string, inviteId: string, label: string): Promise<Guest> {
    try {
      const accessToken = getAuth().getAccessToken();
      const response = await apiRequest(`/events/${eventId}/invites/pending/${inviteId}`, {
        method: 'PATCH',
        body: JSON.stringify({ label }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response as unknown as Guest;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to update pending invite. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },

  async redeemEventInvite(inviteId: string, useAuth: boolean): Promise<Event> {
    try {
      const response = await apiRequest(`/events/join/${inviteId}`, {
        method: 'POST',
        body: JSON.stringify({ useAuth }),
      }, useAuth, true);
      return response as unknown as Event;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to redeem event invite. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  }, 

  async getEventVendorsProfiles(eventId: string): Promise<Vendor[]> {
    try {
      const accessToken = getAuth().getAccessToken();
      const response = await apiRequest(`/event-vendors/event-id/${eventId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response as unknown as Vendor[];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to fetch pending invites. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },
   
  async addVendorImage(data: VendorImageCreation): Promise<void> {
    try {
      const response = await apiRequest(`/event-vendors/image`, {
        method: 'POST',
        body: JSON.stringify( data ),
      });
      return  response as unknown as void;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to upload image. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  }, 

  async getEventVendorImages(eventVendorId: string): Promise<VendorImageData[]> {
    try {
      const accessToken = getAuth().getAccessToken();
      const response = await apiRequest(`/event-vendors/images/${eventVendorId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response as unknown as VendorImageData[];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to fetch pending invites. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },
  
  async leaveEvent(eventId: string): Promise<void> {
    try {
      const accessToken = getAuth().getAccessToken();
      await apiRequest(`/events/${eventId}/leave`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }, false, true);
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to leave event. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  },
  

  async updateVendorDescription(data: VendorDescriptionUpdate): Promise<void> {
    try {
      const accessToken = getAuth().getAccessToken();
      const response = await apiRequest(`/event-vendors/`, {
        method: 'PATCH',
        body: JSON.stringify(data),  // Remove the wrapper object
        headers: {
          'Content-Type': 'application/json',  // Add content type
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return  response as unknown as void;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newErrorMessage = `Failed to update vendor information. ${errorMessage}`;
      console.log(newErrorMessage);
      throw new Error(newErrorMessage);
    }
  }, 


}
// Export individual functions for convenience
export const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  inviteGuest,
  getInviteLink,
  updatePendingInvite,
  redeemEventInvite,
  getEventVendors,
  getEventVendorsProfiles,
  addVendorImage,
  getEventVendorImages, 
  revokeAccess,
  revokePendingInvite,
  getEventGuests,
  getPendingInvites,
  leaveEvent,
  updateVendorDescription
} = EventApiService;


// Export types for use in components
export type {
  CreateEventRequest,
  UpdateEventRequest,
};
