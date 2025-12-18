import { supabase } from "@/src/lib/supabase";
import { User } from "@/src/types/user";
import { useQuery } from "@tanstack/react-query";

export const useUsersQuery = (companyId: string | undefined) => {
  return useQuery({
    queryKey: ["users", companyId],
    queryFn: async () => {
      if (!companyId) {
        return [];
      }

      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("company_id", companyId)
        .order("role")
        .order("name");

      if (error) {
        console.error("[useUsersQuery] Error fetching users:", error);
        throw error;
      }
      
      return data as User[];
    },
    enabled: !!companyId,
    staleTime: 1000 * 60, // 1 minute - refetch more frequently for user list
    refetchOnMount: "always",
  });
};
