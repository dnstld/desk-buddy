import { RoomWithDetails } from "@/src/types/room";

// Mock users for reservations
const mockUsers = [
  { id: "user-1", email: "sarah.johnson@company.com", name: "sarah.johnson", auth_id: "auth-1" },
  { id: "user-2", email: "mike.chen@company.com", name: "mike.chen", auth_id: "auth-2" },
  { id: "user-3", email: "alex.rivera@company.com", name: "alex.rivera", auth_id: "auth-3" },
  { id: "user-4", email: "emma.watson@company.com", name: "emma.watson", auth_id: "auth-4" },
  { id: "user-5", email: "james.lee@company.com", name: "james.lee", auth_id: "auth-5" },
  { id: "user-6", email: "olivia.martin@company.com", name: "olivia.martin", auth_id: "auth-6" },
];

export const mockRooms: RoomWithDetails[] = [
  {
    id: "mock-workspace-1",
    name: "This is a Workspace Room",
    description:
      "Here, you can describe the room and provide helpful information for users selecting a seat",
    floor: 1,
    capacity: 24,
    type: "workspace",
    wheelchair_accessible: true,
    has_elevator: true,
    pet_friendly: true,
    published: false,
    company_id: null,
    deleted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    seats: Array.from({ length: 12 }, (_, i) => {
      // Add reservations to some random seats (seats 2, 4, 5, 7, 9, 10)
      const reservedSeats = [2, 4, 5, 7, 9, 10];
      const hasReservation = reservedSeats.includes(i + 1);
      const userIndex = reservedSeats.indexOf(i + 1); // Each reserved seat gets a unique user
      const mockUser = hasReservation ? mockUsers[userIndex] : null;

      return {
        id: `mock-seat-workspace-${i + 1}`,
        room_id: "mock-workspace-1",
        seat_number: i + 1,
        status: "available" as const,
        deleted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reservation: hasReservation
          ? [
              {
                id: `mock-reservation-ws-${i + 1}`,
                seat_id: `mock-seat-workspace-${i + 1}`,
                user_id: mockUser!.id,
                booking_date: new Date().toISOString(),
                deleted_at: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                user: {
                  id: mockUser!.id,
                  auth_id: mockUser!.auth_id,
                  email: mockUser!.email,
                  created_at: new Date().toISOString(),
                  role: "member" as const,
                  company_id: null,
                  name: mockUser!.name,
                },
              },
            ]
          : [],
      };
    }),
  },
  {
    id: "mock-meeting-1",
    name: "This is a Meeting Room",
    description: "A smaller room designed for focused meetings and collaborations",
    floor: 2,
    capacity: 8,
    type: "meeting",
    wheelchair_accessible: true,
    has_elevator: true,
    pet_friendly: true,
    published: false,
    company_id: null,
    deleted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    seats: Array.from({ length: 8 }, (_, i) => {
      // Add reservations to some seats (seats 1, 3, 6)
      const hasReservation = [1, 3, 6].includes(i + 1);
      const userIndex = Math.floor(Math.random() * mockUsers.length);
      const mockUser = mockUsers[userIndex];

      return {
        id: `mock-seat-meeting-${i + 1}`,
        room_id: "mock-meeting-1",
        seat_number: i + 1,
        status: "available" as const,
        deleted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reservation: hasReservation
          ? [
              {
                id: `mock-reservation-mr-${i + 1}`,
                seat_id: `mock-seat-meeting-${i + 1}`,
                user_id: mockUser.id,
                booking_date: new Date().toISOString(),
                deleted_at: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                user: {
                  id: mockUser.id,
                  auth_id: mockUser.auth_id,
                  email: mockUser.email,
                  created_at: new Date().toISOString(),
                  role: "member" as const,
                  company_id: null,
                  name: mockUser.name,
                },
              },
            ]
          : [],
      };
    }),
  },
];

