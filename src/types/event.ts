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
  date_time: string;
  capacity?: number;
  
  // New fields for dashboard
  id: string;
  host_id: string;
  attendeeCount?: number;
  createdAt: string;
  eventPass?: string; // QR code data for free event pass access
}

// Mock data for development
export const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Team Building Workshop',
    description: 'A fun team building session with various activities and exercises to improve collaboration.',
    location: 'Conference Room A, Downtown Office',
    date_time: '2025-08-15T14:00:00.000Z',
    capacity: 25,
    host_id: 'some-host-id', // Replace with actual host ID logic
    attendeeCount: 12,
    createdAt: '2025-07-20T10:00:00.000Z',
    eventPass: 'EVENT_PASS_TEAM_2025_QR_DATA'
  },
  {
    id: '2',
    name: 'Coffee Chat & Networking',
    description: 'Casual networking event over coffee and pastries.',
    location: 'Starbucks Central Plaza Two',
    date_time: '2025-08-10T09:30:00.000Z',
    host_id: 'some-host-id', // Replace with actual host ID logic
    attendeeCount: 8,
    createdAt: '2025-07-18T15:30:00.000Z',
    eventPass: 'EVENT_PASS_COFFEE_2025_QR_DATA'
  },
  {
    id: '3',
    name: 'Project Kickoff Meeting',
    description: 'Initial meeting to discuss project scope, timeline, and team responsibilities.',
    location: 'Virtual - Zoom Link Provided',
    date_time: '2025-08-20T13:00:00.000Z',
    capacity: 15,
    host_id: 'dcf3cd7a-a7dc-4b11-92db-ad8865e5eebd', // Replace with actual host ID logic
    attendeeCount: 7,
    createdAt: '2025-07-25T11:15:00.000Z',
    eventPass: 'EVENT_PASS_KICK_2025_QR_DATA'
  },
  {
    id: '4',
    name: 'Monthly Book Club',
    description: 'Discussion of this month\'s book selection with snacks and drinks provided.',
    location: 'Community Library - Meeting Room B',
    date_time: '2025-08-05T18:00:00.000Z',
    host_id: 'some-host-id', // Replace with actual host ID logic
    attendeeCount: 23,
    createdAt: '2025-07-12T09:45:00.000Z',
    eventPass: 'EVENT_PASS_BOOK_2025_QR_DATA'
  },
  {
    id: '5',
    name: 'Quarterly Sales Review',
    description: 'Comprehensive review of Q2 performance and Q3 planning session.',
    location: 'Executive Conference Room',
    date_time: '2025-08-25T10:00:00.000Z',
    capacity: 12,
    host_id: 'some-host-id', // Replace with actual host ID logic
    attendeeCount: 9,
    createdAt: '2025-07-28T14:20:00.000Z',
    eventPass: 'EVENT_PASS_SALES_Q3_2025_QR_DATA'
  },
  {
    id: '6',
    name: 'Weekend Hiking Trip',
    description: 'Group hiking adventure to nearby mountain trails with lunch included.',
    location: 'Mountain Trail Park - Main Entrance',
    date_time: '2025-08-12T08:00:00.000Z',
    host_id: 'dcf3cd7a-a7dc-4b11-92db-ad8865e5eebd', // Replace with actual host ID logic
    attendeeCount: 16,
    createdAt: '2025-07-15T16:00:00.000Z',
    eventPass: 'EVENT_PASS_HIKE_2025_QR_DATA'
  }
];
