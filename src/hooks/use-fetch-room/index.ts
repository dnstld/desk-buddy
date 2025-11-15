import { supabase } from "@/src/lib/supabase";
import { RoomWithDetails } from "@/src/types/room";
import { useEffect, useState } from "react";

export function useFetchRoom(id: string | undefined) {
  const [room, setRoom] = useState<RoomWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: roomData, error: roomError } = await supabase
          .from("room")
          .select(
            `
            *,
            seats:seat(
              *,
              seat_amenities(
                amenity_id,
                amenities(*)
              ),
              reservation(
                *,
                user(*)
              )
            )
          `
          )
          .eq("id", id)
          .is("deleted_at", null)
          .single();

        if (roomError) throw roomError;
        if (!roomData) throw new Error("Room not found");

        setRoom(roomData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch room");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoom();
    }
  }, [id]);

  return {
    room,
    setRoom,
    loading,
    error,
  };
}
