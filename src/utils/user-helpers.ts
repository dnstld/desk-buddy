import { supabase } from "@/src/lib/supabase";
import { Database } from "@/supabase/types";

type UserRow = Database["public"]["Tables"]["user"]["Row"];

/**
 * Safely fetches user data by auth_id with proper error handling
 * 
 * This function uses parameterized queries to prevent SQL injection
 * and provides consistent error messages across the application.
 * 
 * @param authId - The Supabase auth user ID
 * @returns User data with company_id
 * @throws Error with user-friendly message if user not found or invalid
 */
export async function fetchUserWithCompany(authId: string): Promise<UserRow> {
  // Use .eq() with parameterized query instead of .or() with string interpolation
  // This prevents SQL injection and is more performant
  const { data: userData, error: userError } = await supabase
    .from("user")
    .select("*")
    .eq("auth_id", authId)
    .maybeSingle();

  if (userError) {
    throw new Error(`Failed to fetch user data: ${userError.message}`);
  }

  if (!userData) {
    throw new Error(
      "Your user profile is not set up. Please sign out and sign in again, or contact support."
    );
  }

  if (!userData.company_id) {
    throw new Error(
      "Your account is not associated with any company. Please contact your administrator."
    );
  }

  return userData;
}

/**
 * Validates that a user is authenticated
 * 
 * @param user - The user object from useAuth()
 * @throws Error if user is not authenticated
 */
export function requireAuth(user: any): asserts user {
  if (!user) {
    throw new Error("You must be authenticated to perform this action");
  }
}
