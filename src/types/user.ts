import { Database } from "@/supabase/types";

// Use Supabase database types directly
export type User = Database["public"]["Tables"]["user"]["Row"];

export type UserInsert = Database["public"]["Tables"]["user"]["Insert"];

export type UserUpdate = Database["public"]["Tables"]["user"]["Update"];

// Enum types
export type UserRole = Database["public"]["Enums"]["roles"];
