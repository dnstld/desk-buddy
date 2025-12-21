import { supabase } from "@/src/lib/supabase";
import { User } from "@/src/types/user";
import { useCallback, useEffect, useState } from "react";

export function useFetchUser(id: string | undefined) {
  const [data, setData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: userData, error: userError } = await supabase
          .from("user")
          .select("*")
          .eq("id", id)
          .single();

        if (userError) throw userError;
        if (!userData) throw new Error("User not found");

        setData(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, refetchTrigger]);

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
