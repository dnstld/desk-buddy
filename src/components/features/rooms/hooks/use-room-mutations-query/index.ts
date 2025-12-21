import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/src/lib/supabase";
import {
  createPendingAmenities,
  createSeatsWithAmenities,
  deleteRoomSeatsAndAmenities,
  prepareRoomData,
} from "@/src/shared/utils/room-mutation-helpers";
import { fetchUserWithCompany, requireAuth } from "@/src/shared/utils/user-helpers";
import { RoomFormData } from "@/src/shared/validations/room-form";
import { Database } from "@/supabase/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type RoomInsert = Database["public"]["Tables"]["room"]["Insert"];

/**
 * Hook for creating a new room
 */
export function useCreateRoomMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: RoomFormData) => {
      requireAuth(user);

      // Securely fetch user data with parameterized query (prevents SQL injection)
      const userData = await fetchUserWithCompany(user.id);

      // Prepare room data
      const roomData: RoomInsert = {
        ...(prepareRoomData(formData, userData.company_id!) as RoomInsert),
        published: false,
      };

      // Insert the room
      const { data: newRoom, error: roomError } = await supabase
        .from("room")
        .insert(roomData)
        .select()
        .single();

      if (roomError) throw roomError;

      if (!newRoom) {
        throw new Error(
          "Room was not created due to Row Level Security policies."
        );
      }

      // Create amenities and seats if provided
      if (formData.seats && formData.seats.length > 0) {
        const amenityIdMap = await createPendingAmenities(
          formData.seats,
          userData.company_id!,
          userData.id
        );

        await createSeatsWithAmenities(
          newRoom.id,
          formData.seats,
          amenityIdMap
        );
      }

      return newRoom;
    },
    onSuccess: () => {
      // Invalidate rooms query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

/**
 * Hook for updating a room
 */
export function useUpdateRoomMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roomId,
      formData,
    }: {
      roomId: string;
      formData: Partial<RoomFormData>;
    }) => {
      requireAuth(user);

      // Securely fetch user data with parameterized query (prevents SQL injection)
      const userData = await fetchUserWithCompany(user.id);

      // Prepare update data using helper function
      const updateData = prepareRoomData(formData, "");

      // Update the room
      const { data, error } = await supabase
        .from("room")
        .update(updateData)
        .eq("id", roomId)
        .select()
        .single();

      if (error) throw error;

      // Handle seat updates if seat data is provided
      if (formData.seats !== undefined && formData.seats.length > 0) {
        // Delete existing seats and amenities
        await deleteRoomSeatsAndAmenities(roomId);

        // Create pending amenities
        const amenityIdMap = await createPendingAmenities(
          formData.seats,
          userData.company_id!,
          userData.id
        );

        // Create new seats with amenities
        await createSeatsWithAmenities(roomId, formData.seats, amenityIdMap);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

/**
 * Hook for soft-deleting a room
 */
export function useDeleteRoomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      const { error } = await supabase
        .from("room")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", roomId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

/**
 * Hook for publishing/unpublishing a room
 */
export function useToggleRoomPublishMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roomId,
      published,
    }: {
      roomId: string;
      published: boolean;
    }) => {
      const { data, error } = await supabase
        .from("room")
        .update({ published })
        .eq("id", roomId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}