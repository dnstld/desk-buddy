import { Database } from "@/supabase/types";

// Use Supabase database types directly
export type User = Database["public"]["Tables"]["user"]["Row"];

// The table is named 'reservations' but the relationship returns as 'reservation'
export type Reservation = Database["public"]["Tables"]["reservations"]["Row"] & {
  user?: User;
};

export type Seat = Database["public"]["Tables"]["seat"]["Row"] & {
  reservation?: Reservation[]; // Note: singular field name but plural data
};

export type Room = Database["public"]["Tables"]["room"]["Row"] & {
  seats?: Seat[];
};

export type RoomWithDetails = Room;
