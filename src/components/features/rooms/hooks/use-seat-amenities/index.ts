import { supabase } from "@/src/lib/supabase";
import { Database } from "@/supabase/types";
import { useQuery } from "@tanstack/react-query";

type SeatAmenity = Database["public"]["Tables"]["seat_amenities"]["Row"];

export function useSeatAmenities(seatId: string | null) {
  return useQuery({
    queryKey: ["seat-amenities", seatId],
    queryFn: async () => {
      if (!seatId) return [];

      const { data, error } = await supabase
        .from("seat_amenities")
        .select("*")
        .eq("seat_id", seatId);

      if (error) throw error;
      return data as SeatAmenity[];
    },
    enabled: !!seatId,
  });
}
