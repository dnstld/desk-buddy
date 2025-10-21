import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/src/lib/supabase";
import { RoomFormData } from "@/src/validations/room-form";
import { Database } from "@/supabase/types";
import { useState } from "react";

type RoomInsert = Database["public"]["Tables"]["room"]["Insert"];

export function useRoomMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createRoom = async (formData: RoomFormData) => {
    if (!user) {
      throw new Error("User must be authenticated to create a room");
    }

    try {
      setLoading(true);
      setError(null);

      // Get user's company_id - try both id and auth_id
      const { data: userDataArray, error: userError } = await supabase
        .from("user")
        .select("company_id, id, auth_id, email, name")
        .or(`id.eq.${user.id},auth_id.eq.${user.id}`);

      if (userError) {
        throw new Error(
          `Failed to find user in database: ${userError.message}`
        );
      }

      if (!userDataArray || userDataArray.length === 0) {
        throw new Error(
          `Your user profile is not set up. Please sign out and sign in again, or contact support. (Auth ID: ${user.id})`
        );
      }

      const userData = userDataArray[0];

      if (!userData?.company_id) {
        throw new Error(
          "Your account is not associated with any company. Please contact your administrator to assign you to a company."
        );
      }

      // Prepare room data for insertion
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
        published: false, // New rooms start as unpublished
      };

      // Insert the room
      const { data: newRoom, error: roomError } = await supabase
        .from("room")
        .insert(roomData)
        .select();

      if (roomError) {
        throw roomError;
      }

      if (!newRoom || newRoom.length === 0) {
        throw new Error(
          "Room was not created. This might be due to Row Level Security policies."
        );
      }

      const createdRoom = newRoom[0];

      // Create seats for the room
      if (createdRoom && formData.totalSeats > 0) {
        const seats = Array.from({ length: formData.totalSeats }, (_, i) => ({
          // Let Postgres generate the UUID automatically by not specifying id
          room_id: createdRoom.id,
          status: "available" as const,
        }));

        const { error: seatsError } = await supabase.from("seat").insert(seats);

        if (seatsError) {
          // Optionally: Delete the room if seats creation fails
          throw new Error(`Failed to create seats: ${seatsError.message}`);
        }
      }

      return createdRoom;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create room";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRoom = async (roomId: string, formData: RoomFormData) => {
    if (!user) {
      throw new Error("User must be authenticated to update a room");
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare room data for update
      const roomData: Database["public"]["Tables"]["room"]["Update"] = {
        name: formData.name,
        description: formData.description || null,
        type: formData.meeting ? "meeting" : "workspace",
        capacity: formData.totalSeats,
        floor: formData.floor,
        wheelchair_accessible: formData.wheelchair,
        has_elevator: formData.elevator,
        pet_friendly: formData.petFriendly,
        updated_at: new Date().toISOString(),
      };

      // Update the room
      const { data: updatedRoom, error: roomError } = await supabase
        .from("room")
        .update(roomData)
        .eq("id", roomId)
        .select()
        .single();

      if (roomError) throw roomError;
      if (!updatedRoom) throw new Error("No data returned from update");

      // Handle seat count changes
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

      return updatedRoom;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update room";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRoom = async (roomId: string) => {
    if (!user) {
      throw new Error("User must be authenticated to delete a room");
    }

    try {
      setLoading(true);
      setError(null);

      // Hard delete associated seats first (due to foreign key constraints)
      const { error: seatsError } = await supabase
        .from("seat")
        .delete()
        .eq("room_id", roomId);

      if (seatsError) throw seatsError;

      // Hard delete the room
      const { error: roomError } = await supabase
        .from("room")
        .delete()
        .eq("id", roomId);

      if (roomError) throw roomError;

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete room";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const publishRoom = async (roomId: string, published: boolean) => {
    if (!user) {
      throw new Error("User must be authenticated to publish a room");
    }

    try {
      setLoading(true);
      setError(null);

      const { data: updatedRoom, error: roomError } = await supabase
        .from("room")
        .update({
          published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", roomId)
        .select()
        .single();

      if (roomError) throw roomError;

      return updatedRoom;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to publish room";
      setError(errorMessage);
      console.error("Error publishing room:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createRoom,
    updateRoom,
    deleteRoom,
    publishRoom,
    loading,
    error,
  };
}
