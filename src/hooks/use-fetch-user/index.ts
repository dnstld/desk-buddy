import { supabase } from "@/src/lib/supabase";
import { User } from "@/src/types/user";
import { useQuery } from "@tanstack/react-query";

export const useFetchUser = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data as User;
    },
    enabled: !!userId,
  });
};
