import { supabase } from "@/src/lib/supabase";
import { Database } from "@/supabase/types";
import { useQuery } from "@tanstack/react-query";

type Amenity = Database["public"]["Tables"]["amenities"]["Row"];

export function useAmenities(companyId: string | null) {
  return useQuery({
    queryKey: ["amenities", companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from("amenities")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Amenity[];
    },
    enabled: !!companyId,
  });
}
