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
      const totalSeats = formData.totalSeats;
      const roomData: RoomInsert = {
        name: formData.name,
        description: formData.description || null,
        type: formData.meeting ? "meeting" : "workspace",
        capacity: totalSeats,
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

      // Step 1: Create pending amenities first and collect their IDs
      const amenityIdMap = new Map<string, string>(); // Maps pending amenity name to created ID

      if (formData.seats && formData.seats.length > 0) {
        // Collect all unique pending amenities across all seats
        const allPendingAmenities = new Set<string>();
        formData.seats.forEach((seat) => {
          if (seat.pendingAmenities) {
            seat.pendingAmenities.forEach((name) => allPendingAmenities.add(name));
          }
        });

        console.log(`Creating ${allPendingAmenities.size} pending amenities:`, Array.from(allPendingAmenities));

        // Create each pending amenity
        for (const amenityName of allPendingAmenities) {
          const { data: amenityData, error: amenityError } = await supabase
            .from("amenities")
            .insert({
              name: amenityName,
              company_id: userData.company_id,
              created_by: userData.id,
            })
            .select()
            .single();

          if (amenityError) {
            console.error(`Error creating amenity "${amenityName}":`, amenityError);
            // Continue with other amenities even if one fails
          } else if (amenityData) {
            console.log(`Created amenity "${amenityName}" with ID:`, amenityData.id);
            amenityIdMap.set(amenityName, amenityData.id);
          }
        }
      }

      // Step 2: Create seats for the room
      if (formData.seats && formData.seats.length > 0) {
        const seats = formData.seats.map((seat) => ({
          room_id: newRoom.id,
          number: seat.number,
          status: "available" as const,
          note: seat.isSpecial ? seat.note || null : null,
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

        // Step 3: Create seat_amenities for each seat
        if (insertedSeats && insertedSeats.length > 0) {
          const allSeatAmenities: {
            seat_id: string;
            amenity_id: string;
            enabled: boolean;
          }[] = [];

          insertedSeats.forEach((insertedSeat, index) => {
            const formSeat = formData.seats[index];
            
            console.log(`Processing seat ${index + 1}:`, {
              amenities: formSeat.amenities,
              pendingAmenities: formSeat.pendingAmenities,
            });
            
            // Combine existing amenity IDs with newly created ones from pending
            const amenityIds = [...(formSeat.amenities || [])];
            
            // Add IDs for pending amenities that were just created
            if (formSeat.pendingAmenities) {
              formSeat.pendingAmenities.forEach((name) => {
                const createdId = amenityIdMap.get(name);
                if (createdId) {
                  console.log(`Adding pending amenity "${name}" with ID ${createdId}`);
                  amenityIds.push(createdId);
                }
              });
            }

            console.log(`Total amenity IDs for seat ${index + 1}:`, amenityIds);

            // Create seat_amenities records
            amenityIds.forEach((amenityId) => {
              allSeatAmenities.push({
                seat_id: insertedSeat.id,
                amenity_id: amenityId,
                enabled: true,
              });
            });
          });

          console.log(`Inserting ${allSeatAmenities.length} seat_amenities records:`, allSeatAmenities);

          // Insert all seat_amenities at once
          if (allSeatAmenities.length > 0) {
            const { error: seatAmenitiesError } = await supabase
              .from("seat_amenities")
              .insert(allSeatAmenities);

            if (seatAmenitiesError) {
              console.error("Error creating seat amenities:", seatAmenitiesError);
              // Don't throw - seats were created successfully
            } else {
              console.log(`Successfully created ${allSeatAmenities.length} seat amenity associations`);
            }
          }
        }
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
      if (!user) {
        throw new Error("User must be authenticated to update a room");
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
      
      // Calculate total seats from new structure
      if (formData.totalSeats !== undefined) {
        updateData.capacity = formData.totalSeats;
      }

      // Update the room
      const { data, error } = await supabase
        .from("room")
        .update(updateData)
        .eq("id", roomId)
        .select()
        .single();

      if (error) throw error;

      // Handle seat updates if seat data is provided
      if (formData.seats !== undefined) {
        // Step 1: Create pending amenities first and collect their IDs
        const amenityIdMap = new Map<string, string>(); // Maps pending amenity name to created ID

        if (formData.seats && formData.seats.length > 0) {
          // Collect all unique pending amenities across all seats
          const allPendingAmenities = new Set<string>();
          formData.seats.forEach((seat) => {
            if (seat.pendingAmenities) {
              seat.pendingAmenities.forEach((name) => allPendingAmenities.add(name));
            }
          });

          console.log(`[UPDATE] Creating ${allPendingAmenities.size} pending amenities:`, Array.from(allPendingAmenities));

          // Create each pending amenity
          for (const amenityName of allPendingAmenities) {
            const { data: amenityData, error: amenityError } = await supabase
              .from("amenities")
              .insert({
                name: amenityName,
                company_id: userData.company_id,
                created_by: userData.id,
              })
              .select()
              .single();

            if (amenityError) {
              console.error(`[UPDATE] Error creating amenity "${amenityName}":`, amenityError);
              // Continue with other amenities even if one fails
            } else if (amenityData) {
              console.log(`[UPDATE] Created amenity "${amenityName}" with ID:`, amenityData.id);
              amenityIdMap.set(amenityName, amenityData.id);
            }
          }
        }

        // Step 2: Delete all existing seat_amenities and seats for this room
        // First, get all seat IDs for this room
        const { data: existingSeats, error: fetchSeatsError } = await supabase
          .from("seat")
          .select("id")
          .eq("room_id", roomId);

        if (fetchSeatsError) {
          console.error("[UPDATE] Error fetching existing seats:", fetchSeatsError);
          throw fetchSeatsError;
        }

        // Delete seat_amenities for all these seats
        if (existingSeats && existingSeats.length > 0) {
          const seatIds = existingSeats.map(s => s.id);
          console.log(`[UPDATE] Deleting seat_amenities for ${seatIds.length} seats`);
          
          const { error: deleteAmenitiesError } = await supabase
            .from("seat_amenities")
            .delete()
            .in("seat_id", seatIds);

          if (deleteAmenitiesError) {
            console.error("[UPDATE] Error deleting seat_amenities:", deleteAmenitiesError);
            // Continue anyway - seats might not have amenities
          } else {
            console.log("[UPDATE] Successfully deleted seat_amenities");
          }
        }

        // Now delete the seats
        console.log(`[UPDATE] Deleting seats for room ${roomId}`);
        const { error: deleteSeatsError } = await supabase
          .from("seat")
          .delete()
          .eq("room_id", roomId);

        if (deleteSeatsError) {
          console.error("[UPDATE] Error deleting seats:", deleteSeatsError);
          throw deleteSeatsError;
        }

        console.log("[UPDATE] Successfully deleted seats");

        // Step 3: Insert new seats
        if (formData.seats.length > 0) {
          const seats = formData.seats.map((seat) => ({
            room_id: roomId,
            number: seat.number,
            status: "available" as const,
            note: seat.isSpecial ? seat.note || null : null,
          }));

          console.log(`[UPDATE] Creating ${seats.length} seats for room ${roomId}`);

          const { data: insertedSeats, error: insertError } = await supabase
            .from("seat")
            .insert(seats)
            .select();

          if (insertError) {
            console.error("[UPDATE] Error creating seats:", insertError);
            throw new Error(`Failed to create seats: ${insertError.message}`);
          }

          console.log(`[UPDATE] Successfully created ${insertedSeats?.length || 0} seats`);

          // Step 4: Create seat_amenities for each seat
          if (insertedSeats && insertedSeats.length > 0) {
            const allSeatAmenities: {
              seat_id: string;
              amenity_id: string;
              enabled: boolean;
            }[] = [];

            insertedSeats.forEach((insertedSeat, index) => {
              const formSeat = formData.seats![index];
              
              console.log(`[UPDATE] Processing seat ${index + 1}:`, {
                amenities: formSeat.amenities,
                pendingAmenities: formSeat.pendingAmenities,
              });
              
              // Combine existing amenity IDs with newly created ones from pending
              const amenityIds = [...(formSeat.amenities || [])];
              
              // Add IDs for pending amenities that were just created
              if (formSeat.pendingAmenities) {
                formSeat.pendingAmenities.forEach((name) => {
                  const createdId = amenityIdMap.get(name);
                  if (createdId) {
                    console.log(`[UPDATE] Adding pending amenity "${name}" with ID ${createdId}`);
                    amenityIds.push(createdId);
                  }
                });
              }

              console.log(`[UPDATE] Total amenity IDs for seat ${index + 1}:`, amenityIds);

              // Create seat_amenities records (only for enabled amenities)
              amenityIds.forEach((amenityId) => {
                allSeatAmenities.push({
                  seat_id: insertedSeat.id,
                  amenity_id: amenityId,
                  enabled: true,
                });
              });
            });

            console.log(`[UPDATE] Inserting ${allSeatAmenities.length} seat_amenities records:`, allSeatAmenities);

            // Insert all seat_amenities at once
            if (allSeatAmenities.length > 0) {
              const { error: seatAmenitiesError } = await supabase
                .from("seat_amenities")
                .insert(allSeatAmenities);

              if (seatAmenitiesError) {
                console.error("[UPDATE] Error creating seat amenities:", seatAmenitiesError);
                // Don't throw - seats were created successfully
              } else {
                console.log(`[UPDATE] Successfully created ${allSeatAmenities.length} seat amenity associations`);
              }
            } else {
              console.log("[UPDATE] No amenities to create for this room");
            }
          }
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