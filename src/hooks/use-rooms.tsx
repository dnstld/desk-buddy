import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/src/lib/supabase";
import { RoomWithDetails } from "@/src/types/room";
import { useEffect, useState } from "react";

export function useRooms() {
  const [rooms, setRooms] = useState<RoomWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchRooms();
  }, [user]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch rooms with seats and reservations
      const { data: roomsData, error: roomsError } = await supabase
        .from("room")
        .select(
          `
          *,
          seats:seat(
            *,
            reservations(
              *,
              user(*)
            )
          )
        `
        )
        .is("deleted_at", null)
        .eq("published", true)
        .order("floor", { ascending: true })
        .order("name", { ascending: true });

      if (roomsError) throw roomsError;

      // Use the data directly from the database
      setRooms(roomsData || []);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchRooms();
  };

  return {
    rooms,
    loading,
    error,
    refetch,
  };
}
