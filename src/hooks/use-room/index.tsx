import { RoomWithDetails } from "@/src/types/room";
import { useMemo } from "react";

export function useRoom(room: RoomWithDetails) {
  const {
    room_name,
    color,
    seats,
    meeting,
    description,
    floor,
    wheelchair,
    elevator,
    pet_friendly,
  } = room;

  const occupancyData = useMemo(() => {
    const total = seats.length;
    const reserved = seats.filter(
      (seat) => seat.reservations.length > 0
    ).length;
    const available = total - reserved;
    const percent = total > 0 ? (reserved / total) * 100 : 0;

    return {
      totalSeats: total,
      reservedSeats: reserved,
      availableSeats: available,
      percentOccupied: Math.round(percent),
    };
  }, [seats]);

  const roomStatus = useMemo(() => {
    const { totalSeats, reservedSeats } = occupancyData;

    if (reservedSeats === 0) {
      return { label: "Available", variant: "success" as const };
    }

    if (reservedSeats === totalSeats) {
      return { label: "Full", variant: "danger" as const };
    }

    return { label: "Partially occupied", variant: "warning" as const };
  }, [occupancyData]);

  const occupancyText = useMemo(() => {
    const { availableSeats, totalSeats } = occupancyData;
    return `${availableSeats} of ${totalSeats} seats available`;
  }, [occupancyData]);

  const hasAmenities = useMemo(() => {
    return wheelchair || elevator || pet_friendly;
  }, [wheelchair, elevator, pet_friendly]);

  return {
    // Data
    room_name,
    color,
    seats,
    meeting,
    description,
    floor,
    wheelchair,
    elevator,
    pet_friendly,

    // Calculated data
    ...occupancyData,
    roomStatus,
    occupancyText,
    hasAmenities,
  };
}
