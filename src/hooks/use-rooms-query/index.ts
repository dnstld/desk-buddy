import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/src/lib/supabase";
import { RoomWithDetails } from "@/src/types/room";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useRoomsQuery() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["rooms"],
    queryFn: fetchRooms,
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });

  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel("rooms-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["rooms"] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, queryClient]);

  return query;
}

async function fetchRooms(): Promise<RoomWithDetails[]> {
  const { data, error } = await supabase
    .from("room")
    .select(
      `
      *,
      seats:seat(
        *,
        reservation(
          *,
          user(*)
        )
      )
    `
    )
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch rooms: ${error.message}`);
  }

  return data || [];
}