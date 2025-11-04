import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/src/lib/supabase";
import { RoomFormData } from "@/src/validations/room-form";
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
      if (!user) {
        throw new Error("User must be authenticated to create a room");
      }

      // Get user's company_id
      const { data: userDataArray, error: userError } = await supabase
        .from("user")
        .select("company_id, id, auth_id, email, name")
        .or(`id.eq.${user.id},auth_id.eq.${user.id}`);

      if (userError) {
        throw new Error(`Failed to find user in database: ${userError.message}`);
      }

      if (!userDataArray || userDataArray.length === 0) {
        throw new Error(
          `Your user profile is not set up. Please sign out and sign in again, or contact support.`
        );
      }

      const userData = userDataArray[0];

      if (!userData?.company_id) {
        throw new Error(
          "Your account is not associated with any company. Please contact your administrator."
        );
      }

      // Prepare room data
      const roomData: RoomInsert = {
        name: formData.name,
        description: formData.description || null,
        type: formData.meeting ? "meeting" : "workspace",
        capacity: formData.totalSeats,
        floor: formData.floor,
        wheelchair_accessible: formData.wheelchair,
        has_elevator: formData.elevator,
        pet_friendly: formData.petFriendly,
        company_id: userData.company_id,
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
        throw new Error("Room was not created due to Row Level Security policies.");
      }

      // Create seats for the room
      if (formData.totalSeats > 0) {
        const seats = Array.from({ length: formData.totalSeats }, () => ({
          room_id: newRoom.id,
          status: "available" as const,
        }));

        console.log(`Creating ${seats.length} seats for room ${newRoom.id}`);

        const { data: insertedSeats, error: seatsError } = await supabase
          .from("seat")
          .insert(seats)
          .select();

        if (seatsError) {
          console.error("Error creating seats:", seatsError);
          throw new Error(`Failed to create seats: ${seatsError.message}`);
        }

        console.log(`Successfully created ${insertedSeats?.length || 0} seats`);
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roomId,
      formData,
    }: {
      roomId: string;
      formData: Partial<RoomFormData>;
    }) => {
      const updateData: Partial<RoomInsert> = {};

      if (formData.name !== undefined) updateData.name = formData.name;
      if (formData.description !== undefined)
        updateData.description = formData.description || null;
      if (formData.floor !== undefined) updateData.floor = formData.floor;
      if (formData.wheelchair !== undefined)
        updateData.wheelchair_accessible = formData.wheelchair;
      if (formData.elevator !== undefined)
        updateData.has_elevator = formData.elevator;
      if (formData.petFriendly !== undefined)
        updateData.pet_friendly = formData.petFriendly;
      if (formData.meeting !== undefined)
        updateData.type = formData.meeting ? "meeting" : "workspace";
      if (formData.totalSeats !== undefined)
        updateData.capacity = formData.totalSeats;

      // Update the room
      const { data, error } = await supabase
        .from("room")
        .update(updateData)
        .eq("id", roomId)
        .select()
        .single();

      if (error) throw error;

      // Handle seat count changes
      if (formData.totalSeats !== undefined) {
        const { data: currentSeats, error: seatsError } = await supabase
          .from("seat")
          .select("id")
          .eq("room_id", roomId)
          .is("deleted_at", null);

        if (seatsError) throw seatsError;

        const currentSeatCount = currentSeats?.length || 0;
        const newSeatCount = formData.totalSeats;

        if (newSeatCount > currentSeatCount) {
          // Add new seats
          const seatsToAdd = newSeatCount - currentSeatCount;
          const newSeats = Array.from({ length: seatsToAdd }, () => ({
            room_id: roomId,
            status: "available" as const,
          }));

          const { error: addSeatsError } = await supabase
            .from("seat")
            .insert(newSeats);

          if (addSeatsError) throw addSeatsError;
        } else if (newSeatCount < currentSeatCount) {
          // Delete excess seats from the database
          const seatsToRemove = currentSeatCount - newSeatCount;
          const seatsToDelete =
            currentSeats?.slice(-seatsToRemove).map((s) => s.id) || [];

          const { error: deleteSeatsError } = await supabase
            .from("seat")
            .delete()
            .in("id", seatsToDelete);

          if (deleteSeatsError) throw deleteSeatsError;
        }
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