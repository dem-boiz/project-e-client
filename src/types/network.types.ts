export interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    description: string;
    capacity: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    isAuthenticated: boolean;
}
export interface CreateEventRequest {
  name: string;
  description?: string;
  location?: string;
  datetime: string;
  host_id: string
}
export interface CreateAccountRequest {
  username: string;
  email: string;
  password: string;
}

export interface CreateAccountResponse {
  id: string;
  name: string;
  created_at: string;
  email: string;
}

// Update Event request type
export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
}

export interface RequestLoginResponse {
  access_token: string;
  csrf_token: string;
  token_type: string;
  email: string;
  user_id: string;
  name: string;
}

export interface RequestLoginData {
  email: string;
  password: string;
}