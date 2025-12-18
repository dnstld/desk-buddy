import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/src/lib/supabase";
import { User, UserRole } from "@/src/types/user";
import { useQuery } from "@tanstack/react-query";

export function useUserQuery() {
  const { user, session } = useAuth();

  return useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => fetchUser(user!.id),
    enabled: !!user && !!session,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: "always",
    retry: 2,
  });
}

export function useUser() {
  const query = useUserQuery();
  const role = query.data?.role as UserRole | undefined;

  return {
    ...query,
    userData: query.data,
    role,
    isOwner: role === "owner",
    isManager: role === "manager",
    isMember: role === "member",
  };
}

async function fetchUser(authId: string): Promise<User> {
  const { data, error } = await supabase
    .from("user")
    .select("id, auth_id, email, name, role, company_id, created_at")
    .eq("auth_id", authId)
    .single();

  console.log("fetchUser - raw data:", data);

  if (error) {
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }

  if (!data) {
    throw new Error("User data not found. Please try signing in again.");
  }

  if (!data.role) {
    throw new Error("User role is not set. Please contact support.");
  }

  if (!data.company_id) {
    throw new Error("Company information is missing. Please contact support.");
  }

  return data;
}