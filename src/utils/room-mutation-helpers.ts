import { supabase } from "@/src/lib/supabase";
import { RoomFormData, SeatFormData } from "@/src/validations/room-form";
import { Database } from "@/supabase/types";
import { logger } from "./logger";

type RoomInsert = Database["public"]["Tables"]["room"]["Insert"];

/**
 * Creates pending amenities and returns a map of amenity names to their IDs
 * 
 * @param seats - Array of seat form data
 * @param companyId - Company ID for the amenities
 * @param userId - User ID who is creating the amenities
 * @returns Map of amenity names to their created IDs
 */
export async function createPendingAmenities(
  seats: SeatFormData[],
  companyId: string,
  userId: string
): Promise<Map<string, string>> {
  const amenityIdMap = new Map<string, string>();

  // Collect all unique pending amenities across all seats
  const allPendingAmenities = new Set<string>();
  seats.forEach((seat) => {
    seat.pendingAmenities?.forEach((name) => allPendingAmenities.add(name));
  });

  if (allPendingAmenities.size === 0) {
    return amenityIdMap;
  }

  logger.debug(
    `Creating ${allPendingAmenities.size} pending amenities:`,
    Array.from(allPendingAmenities)
  );

  // Create each pending amenity
  for (const amenityName of allPendingAmenities) {
    const { data: amenityData, error: amenityError } = await supabase
      .from("amenities")
      .insert({
        name: amenityName,
        company_id: companyId,
        created_by: userId,
      })
      .select()
      .single();

    if (amenityError) {
      logger.error(
        `Error creating amenity "${amenityName}"`,
        amenityError
      );
      // Continue with other amenities even if one fails
    } else if (amenityData) {
      logger.debug(`Created amenity "${amenityName}" with ID:`, amenityData.id);
      amenityIdMap.set(amenityName, amenityData.id);
    }
  }

  return amenityIdMap;
}

/**
 * Creates seats for a room with their associated amenities
 * 
 * @param roomId - ID of the room to create seats for
 * @param seats - Array of seat form data
 * @param amenityIdMap - Map of pending amenity names to their created IDs
 */
export async function createSeatsWithAmenities(
  roomId: string,
  seats: SeatFormData[],
  amenityIdMap: Map<string, string>
): Promise<void> {
  if (!seats || seats.length === 0) {
    return;
  }

  // Prepare seat inserts
  const seatInserts = seats.map((seat) => ({
    room_id: roomId,
    number: seat.number,
    status: "available" as const,
    note: seat.isSpecial ? seat.note || null : null,
  }));

  logger.debug(`Creating ${seatInserts.length} seats for room ${roomId}`);

  // Insert seats
  const { data: insertedSeats, error: seatsError } = await supabase
    .from("seat")
    .insert(seatInserts)
    .select();

  if (seatsError) {
    throw new Error(`Failed to create seats: ${seatsError.message}`);
  }

  if (!insertedSeats || insertedSeats.length === 0) {
    logger.debug("No seats were created");
    return;
  }

  logger.debug(`Successfully created ${insertedSeats.length} seats`);

  // Create seat amenities
  await createSeatAmenities(insertedSeats, seats, amenityIdMap);
}

/**
 * Creates seat_amenities records for the given seats
 * 
 * @param insertedSeats - Array of inserted seat records from database
 * @param formSeats - Array of seat form data
 * @param amenityIdMap - Map of pending amenity names to their created IDs
 */
async function createSeatAmenities(
  insertedSeats: any[],
  formSeats: SeatFormData[],
  amenityIdMap: Map<string, string>
): Promise<void> {
  const allSeatAmenities: {
    seat_id: string;
    amenity_id: string;
  }[] = [];

  insertedSeats.forEach((insertedSeat, index) => {
    const formSeat = formSeats[index];

    logger.debug(`Processing seat ${index + 1}:`, {
      amenities: formSeat.amenities,
      pendingAmenities: formSeat.pendingAmenities,
    });

    // Combine existing amenity IDs with newly created ones from pending
    const amenityIds = [...(formSeat.amenities || [])];

    // Add IDs for pending amenities that were just created
    formSeat.pendingAmenities?.forEach((name) => {
      const createdId = amenityIdMap.get(name);
      if (createdId) {
        logger.debug(`Adding pending amenity "${name}" with ID ${createdId}`);
        amenityIds.push(createdId);
      }
    });

    logger.debug(`Total amenity IDs for seat ${index + 1}:`, amenityIds);

    amenityIds.forEach((amenityId) => {
      allSeatAmenities.push({
        seat_id: insertedSeat.id,
        amenity_id: amenityId,
      });
    });
  });

  logger.debug(
    `Inserting ${allSeatAmenities.length} seat_amenities records:`,
    allSeatAmenities
  );

  // Insert all seat_amenities at once
  if (allSeatAmenities.length > 0) {
    const { error: seatAmenitiesError } = await supabase
      .from("seat_amenities")
      .insert(allSeatAmenities);

    if (seatAmenitiesError) {
      logger.error("Error creating seat amenities:", seatAmenitiesError);
      // Don't throw - seats were created successfully
    } else {
      logger.debug(
        `Successfully created ${allSeatAmenities.length} seat amenity associations`
      );
    }
  } else {
    logger.debug("No seat amenities to create");
  }
}

/**
 * Deletes all seats and their amenities for a given room
 * 
 * @param roomId - ID of the room to delete seats from
 */
export async function deleteRoomSeatsAndAmenities(
  roomId: string
): Promise<void> {
  // First, get all seat IDs for this room
  const { data: existingSeats, error: fetchSeatsError } = await supabase
    .from("seat")
    .select("id")
    .eq("room_id", roomId);

  if (fetchSeatsError) {
    logger.error("[DELETE] Error fetching existing seats:", fetchSeatsError);
    throw fetchSeatsError;
  }

  // Delete seat_amenities for all these seats
  if (existingSeats && existingSeats.length > 0) {
    const seatIds = existingSeats.map((s) => s.id);
    logger.debug(`[DELETE] Deleting seat_amenities for ${seatIds.length} seats`);

    const { error: deleteAmenitiesError } = await supabase
      .from("seat_amenities")
      .delete()
      .in("seat_id", seatIds);

    if (deleteAmenitiesError) {
      logger.error(
        "[DELETE] Error deleting seat_amenities:",
        deleteAmenitiesError
      );
      // Continue anyway - seats might not have amenities
    } else {
      logger.debug("[DELETE] Successfully deleted seat_amenities");
    }
  }

  // Now delete the seats
  logger.debug(`[DELETE] Deleting seats for room ${roomId}`);
  const { error: deleteSeatsError } = await supabase
    .from("seat")
    .delete()
    .eq("room_id", roomId);

  if (deleteSeatsError) {
    logger.error("[DELETE] Error deleting seats:", deleteSeatsError);
    throw deleteSeatsError;
  }

  logger.debug("[DELETE] Successfully deleted seats");
}

/**
 * Prepares room data for insert/update from form data
 * 
 * @param formData - Form data from the room form
 * @param companyId - Company ID for the room
 * @returns Room insert/update data object
 */
export function prepareRoomData(
  formData: Partial<RoomFormData>,
  companyId: string
): Partial<RoomInsert> {
  const roomData: Partial<RoomInsert> = {};

  if (formData.name !== undefined) {
    roomData.name = formData.name;
  }

  if (formData.description !== undefined) {
    roomData.description = formData.description || null;
  }

  if (formData.floor !== undefined) {
    roomData.floor = formData.floor;
  }

  if (formData.wheelchair !== undefined) {
    roomData.wheelchair_accessible = formData.wheelchair;
  }

  if (formData.elevator !== undefined) {
    roomData.has_elevator = formData.elevator;
  }

  if (formData.petFriendly !== undefined) {
    roomData.pet_friendly = formData.petFriendly;
  }

  if (formData.meeting !== undefined) {
    roomData.type = formData.meeting ? "meeting" : "workspace";
  }

  if (formData.totalSeats !== undefined) {
    roomData.capacity = formData.totalSeats;
  }

  // Only set company_id for new rooms
  if (companyId) {
    roomData.company_id = companyId;
  }

  return roomData;
}
