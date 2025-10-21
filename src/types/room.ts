import { Database } from "@/supabase/types";
import { User } from "./user";

// The table is named 'reservation' in the database
export type Reservation = Database["public"]["Tables"]["reservation"]["Row"] & {
  user?: User;
};

export type Seat = Database["public"]["Tables"]["seat"]["Row"] & {
  reservation?: Reservation[]; // Note: singular field name but plural data
};

export type Room = Database["public"]["Tables"]["room"]["Row"] & {
  seats?: Seat[];
};

export type RoomWithDetails = Room;
