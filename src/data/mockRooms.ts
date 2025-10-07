import { RoomWithDetails } from '@/src/types/room';

export const mockRooms: RoomWithDetails[] = [
  {
    id: 1,
    color: "#10b981",
    company_branch_id: 1,
    created_at: "2025-02-06T17:02:47.478408",
    deleted_at: null,
    description: "A bright and spacious room perfect for team meetings and presentations",
    desk_limit: 1,
    elevator: true,
    floor: 3,
    height: null,
    published: true,
    room_name: "Green Valley",
    seat_limit: 12,
    wheelchair: true,
    width: null,
    meeting: false,
    seats: [
      {
        id: 1,
        room_id: 1,
        created_at: "2025-02-06T17:02:47.8774+00:00",
        reservations: [
          {
            id: 56,
            user: {
              id: "24179cc2-6295-4084-beb3-8b200e225850",
              name: "Denis Toledo",
              email: "contato@denistoledo.com.br",
              avatar_url: "https://lh3.googleusercontent.com/a/ACg8ocLYy8sJhETFNFYRpyMcPIWJHXXUgcRJ-81zpXoPHEfjrOnlhq2T=s96-c",
              company_id: 1,
              created_at: "2025-02-03T20:40:29.86416",
              deleted_at: null
            },
            seat_id: 1,
            user_id: "24179cc2-6295-4084-beb3-8b200e225850",
            created_at: "2025-02-20T07:17:17.142235",
            deleted_at: null,
            reservation_date: "2025-02-20T07:16:42.1"
          }
        ]
      },
      {
        id: 2,
        room_id: 1,
        created_at: "2025-02-06T17:02:47.8774+00:00",
        reservations: [
          {
            id: 57,
            user: {
              id: "user-2",
              name: "Sarah Wilson",
              email: "sarah@example.com",
              company_id: 1,
              created_at: "2025-02-03T20:40:29.86416",
              deleted_at: null
            },
            seat_id: 2,
            user_id: "user-2",
            created_at: "2025-02-20T07:17:17.142235",
            deleted_at: null,
            reservation_date: "2025-02-20T07:16:42.1"
          }
        ]
      },
      {
        id: 3,
        room_id: 1,
        created_at: "2025-02-06T17:02:47.8774+00:00",
        reservations: []
      },
      // Add more seats to simulate a fuller room
      ...Array.from({ length: 9 }, (_, i) => ({
        id: i + 4,
        room_id: 1,
        created_at: "2025-02-06T17:02:47.8774+00:00",
        reservations: []
      }))
    ]
  },
  {
    id: 2,
    color: "#8b5cf6",
    company_branch_id: 1,
    created_at: "2025-02-06T17:02:47.478408",
    deleted_at: null,
    description: "Executive meeting room with premium audio/video equipment for important conferences",
    desk_limit: 1,
    elevator: true,
    floor: 5,
    height: null,
    published: true,
    room_name: "Purple Executive",
    seat_limit: 8,
    wheelchair: true,
    width: null,
    meeting: true,
    seats: Array.from({ length: 8 }, (_, i) => ({
      id: i + 20,
      room_id: 2,
      created_at: "2025-02-06T17:02:47.8774+00:00",
      reservations: i < 6 ? [
        {
          id: i + 100,
          user: {
            id: `user-${i}`,
            name: `Executive ${i + 1}`,
            email: `exec${i + 1}@example.com`,
            company_id: 1,
            created_at: "2025-02-03T20:40:29.86416",
            deleted_at: null
          },
          seat_id: i + 20,
          user_id: `user-${i}`,
          created_at: "2025-02-20T07:17:17.142235",
          deleted_at: null,
          reservation_date: "2025-02-20T07:16:42.1"
        }
      ] : []
    }))
  },
  {
    id: 3,
    color: "#ef4444",
    company_branch_id: 1,
    created_at: "2025-02-06T17:02:47.478408",
    deleted_at: null,
    description: "A cozy workspace with natural lighting, perfect for focused individual work",
    desk_limit: 1,
    elevator: false,
    floor: 1,
    height: null,
    published: true,
    room_name: "Red Sunset",
    seat_limit: 6,
    wheelchair: false,
    width: null,
    meeting: false,
    seats: Array.from({ length: 6 }, (_, i) => ({
      id: i + 30,
      room_id: 3,
      created_at: "2025-02-06T17:02:47.8774+00:00",
      reservations: []
    }))
  },
  {
    id: 4,
    color: "#f59e0b",
    company_branch_id: 1,
    created_at: "2025-02-06T17:02:47.478408",
    deleted_at: null,
    description: "Large collaborative space designed for team brainstorming and creative sessions",
    desk_limit: 1,
    elevator: true,
    floor: 2,
    height: null,
    published: true,
    room_name: "Orange Innovation Hub",
    seat_limit: 20,
    wheelchair: true,
    width: null,
    meeting: false,
    seats: Array.from({ length: 20 }, (_, i) => ({
      id: i + 40,
      room_id: 4,
      created_at: "2025-02-06T17:02:47.8774+00:00",
      reservations: i < 15 ? [
        {
          id: i + 200,
          user: {
            id: `user-${i + 40}`,
            name: `Team Member ${i + 1}`,
            email: `team${i + 1}@example.com`,
            company_id: 1,
            created_at: "2025-02-03T20:40:29.86416",
            deleted_at: null
          },
          seat_id: i + 40,
          user_id: `user-${i + 40}`,
          created_at: "2025-02-20T07:17:17.142235",
          deleted_at: null,
          reservation_date: "2025-02-20T07:16:42.1"
        }
      ] : []
    }))
  },
  {
    id: 5,
    color: "#06b6d4",
    company_branch_id: 1,
    created_at: "2025-02-06T17:02:47.478408",
    deleted_at: null,
    description: "Small meeting room ideal for one-on-ones and interviews",
    desk_limit: 1,
    elevator: true,
    floor: 4,
    height: null,
    published: true,
    room_name: "Cyan Interview Room",
    seat_limit: 4,
    wheelchair: true,
    width: null,
    meeting: true,
    seats: Array.from({ length: 4 }, (_, i) => ({
      id: i + 60,
      room_id: 5,
      created_at: "2025-02-06T17:02:47.8774+00:00",
      reservations: i < 4 ? [
        {
          id: i + 300,
          user: {
            id: `user-${i + 60}`,
            name: `Interviewer ${i + 1}`,
            email: `interviewer${i + 1}@example.com`,
            company_id: 1,
            created_at: "2025-02-03T20:40:29.86416",
            deleted_at: null
          },
          seat_id: i + 60,
          user_id: `user-${i + 60}`,
          created_at: "2025-02-20T07:17:17.142235",
          deleted_at: null,
          reservation_date: "2025-02-20T07:16:42.1"
        }
      ] : []
    }))
  },
  {
    id: 6,
    color: "#7c3aed",
    company_branch_id: 1,
    created_at: "2025-02-06T17:02:47.478408",
    deleted_at: null,
    description: "Large boardroom for executive meetings and company-wide presentations with multiple conference tables",
    desk_limit: 1,
    elevator: true,
    floor: 6,
    height: null,
    published: true,
    room_name: "Violet Boardroom",
    seat_limit: 16,
    wheelchair: true,
    width: null,
    meeting: true,
    seats: Array.from({ length: 16 }, (_, i) => ({
      id: i + 70,
      room_id: 6,
      created_at: "2025-02-06T17:02:47.8774+00:00",
      reservations: i < 12 ? [
        {
          id: i + 400,
          user: {
            id: `user-${i + 70}`,
            name: `Board Member ${i + 1}`,
            email: `board${i + 1}@example.com`,
            company_id: 1,
            created_at: "2025-02-03T20:40:29.86416",
            deleted_at: null
          },
          seat_id: i + 70,
          user_id: `user-${i + 70}`,
          created_at: "2025-02-20T07:17:17.142235",
          deleted_at: null,
          reservation_date: "2025-02-20T07:16:42.1"
        }
      ] : []
    }))
  }
];
