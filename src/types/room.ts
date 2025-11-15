import { Database } from "@/supabase/types";
import { User } from "./user";

// The table is named 'reservation' in the database
export type Reservation = Database["public"]["Tables"]["reservation"]["Row"] & {
  user?: User;
};

export type Seat = Database["public"]["Tables"]["seat"]["Row"] & {
  reservation?: Reservation[]; // Note: singular field name but plural data
  seat_amenities?: {
    amenity_id: string;
    enabled: boolean;
    amenities?: Database["public"]["Tables"]["amenities"]["Row"];
  }[];
  pendingAmenities?: string[]; // For form state - new amenities not yet saved to DB
  hasUnsavedAmenityChanges?: boolean; // Flag to indicate if amenities were modified
};

export type SeatWithUser = Seat & {
  user?: User;
  isOccupied: boolean;
};

export type Room = Database["public"]["Tables"]["room"]["Row"] & {
  seats?: Seat[];
};

export type RoomWithDetails = Room;
