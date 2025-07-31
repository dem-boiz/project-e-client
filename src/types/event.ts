// TODO: Replace mock data with Zustand store for global state management
// This will allow for:
// - Client-side filtering/sorting without refetching
// - Shared state between create-event and my-events pages
// - Better performance and user experience

export interface Event {
  // Existing fields from CreateEventPage
  name: string;
  description?: string;
  location?: string;
  date: string;
  capacity?: number;
  isPrivate: boolean;
  
  // New fields for dashboard
  id: string;
  role: 'host' | 'guest';
  status: 'upcoming' | 'ongoing' | 'past';
  attendeeCount?: number;
  createdAt: string;
  eventCode?: string; // Optional: Code used to join the event
}

// Mock data for development
export const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Team Building Workshop',
    description: 'A fun team building session with various activities and exercises to improve collaboration.',
    location: 'Conference Room A, Downtown Office',
    date: '2025-08-15T14:00:00.000Z',
    capacity: 25,
    isPrivate: true,
    role: 'host',
    status: 'upcoming',
    attendeeCount: 12,
    createdAt: '2025-07-20T10:00:00.000Z',
    eventCode: 'TEAM2025'
  },
  {
    id: '2',
    name: 'Coffee Chat & Networking',
    description: 'Casual networking event over coffee and pastries.',
    location: 'Starbucks Central Plaza',
    date: '2025-08-10T09:30:00.000Z',
    isPrivate: false,
    role: 'guest',
    status: 'upcoming',
    attendeeCount: 8,
    createdAt: '2025-07-18T15:30:00.000Z',
    eventCode: 'COFFEE24'
  },
  {
    id: '3',
    name: 'Project Kickoff Meeting',
    description: 'Initial meeting to discuss project scope, timeline, and team responsibilities.',
    location: 'Virtual - Zoom Link Provided',
    date: '2025-08-20T13:00:00.000Z',
    capacity: 15,
    isPrivate: true,
    role: 'host',
    status: 'upcoming',
    attendeeCount: 7,
    createdAt: '2025-07-25T11:15:00.000Z',
    eventCode: 'KICK2025'
  },
  {
    id: '4',
    name: 'Monthly Book Club',
    description: 'Discussion of this month\'s book selection with snacks and drinks provided.',
    location: 'Community Library - Meeting Room B',
    date: '2025-08-05T18:00:00.000Z',
    isPrivate: false,
    role: 'guest',
    status: 'upcoming',
    attendeeCount: 23,
    createdAt: '2025-07-12T09:45:00.000Z',
    eventCode: 'BOOK085'
  },
  {
    id: '5',
    name: 'Quarterly Sales Review',
    description: 'Comprehensive review of Q2 performance and Q3 planning session.',
    location: 'Executive Conference Room',
    date: '2025-08-25T10:00:00.000Z',
    capacity: 12,
    isPrivate: true,
    role: 'host',
    status: 'upcoming',
    attendeeCount: 9,
    createdAt: '2025-07-28T14:20:00.000Z',
    eventCode: 'SALES Q3'
  },
  {
    id: '6',
    name: 'Weekend Hiking Trip',
    description: 'Group hiking adventure to nearby mountain trails with lunch included.',
    location: 'Mountain Trail Park - Main Entrance',
    date: '2025-08-12T08:00:00.000Z',
    isPrivate: false,
    role: 'guest',
    status: 'upcoming',
    attendeeCount: 16,
    createdAt: '2025-07-15T16:00:00.000Z',
    eventCode: 'HIKE812'
  }
];
