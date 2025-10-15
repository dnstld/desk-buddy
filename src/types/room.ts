import { Database } from "@/supabase/types";

// Use Supabase database types directly
export type User = Database["public"]["Tables"]["user"]["Row"];

export type Reservation = Database["public"]["Tables"]["reservations"]["Row"] & {
  user?: User;
};

export type Seat = Database["public"]["Tables"]["seat"]["Row"] & {
  reservations?: Reservation[];
};

export type Room = Database["public"]["Tables"]["room"]["Row"] & {
  seats?: Seat[];
};

export type RoomWithDetails = Room;
