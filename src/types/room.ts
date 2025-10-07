// React Native types based on the NextJS project
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  company_id: number;
  created_at: string;
  deleted_at?: string | null;
}

export interface Reservation {
  id: number;
  user: User;
  seat_id: number;
  user_id: string;
  created_at: string;
  deleted_at?: string | null;
  reservation_date: string;
}

export interface Seat {
  id: number;
  room_id: number;
  created_at: string;
  reservations: Reservation[];
}

export interface Room {
  id: number;
  color: string;
  company_branch_id: number;
  created_at: string;
  deleted_at?: string | null;
  description?: string | null;
  desk_limit: number;
  elevator: boolean;
  floor: number;
  height?: number | null;
  published: boolean;
  room_name: string;
  seat_limit: number;
  wheelchair: boolean;
  width?: number | null;
  meeting?: boolean;
  seats: Seat[];
}

export type RoomWithDetails = Room;
