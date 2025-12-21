import { RoomFormData } from "@/src/shared/validations/room-form";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { ScrollView, View } from "react-native";
import Room from "../room";
import FAB from "@/src/components/ui/fab";

export default function SeatsSection() {
  const { watch, setValue } = useFormContext<RoomFormData>();
  const processedParamsRef = useRef<string>("");
  const params = useLocalSearchParams<{
    seatIndex?: string;
    note?: string;
    action?: string;
    amenities?: string;
    pendingAmenities?: string;
    hasUnsavedAmenityChanges?: string;
  }>();

  const totalSeats = watch("totalSeats");
  const seats = watch("seats");
  const meeting = watch("meeting");
  const name = watch("name");
  const description = watch("description");
  const floor = watch("floor");
  const wheelchair = watch("wheelchair");
  const elevator = watch("elevator");
  const petFriendly = watch("petFriendly");

  // Handle callback from edit-seat page
  useEffect(() => {
    if (params.seatIndex !== undefined && params.action) {
      // Create a unique key for this set of params
      const paramsKey = `${params.seatIndex}-${params.action}-${
        params.note || ""
      }`;

      // Skip if we've already processed these exact params
      if (processedParamsRef.current === paramsKey) {
        return;
      }

      processedParamsRef.current = paramsKey;
      const seatIndex = parseInt(params.seatIndex, 10);

      if (params.action === "delete" && totalSeats > 1) {
        // Delete the seat
        const newSeats = seats.filter((_, index) => index !== seatIndex);
        // Renumber seats
        const renumberedSeats = newSeats.map((seat, index) => ({
          ...seat,
          number: index + 1,
        }));
        setValue("seats", renumberedSeats);
        setValue("totalSeats", totalSeats - 1);

        // Clear params after processing
        setTimeout(() => {
          router.setParams({
            seatIndex: undefined,
            action: undefined,
            note: undefined,
          });
        }, 100);
      } else if (
        params.action === "save" &&
        seatIndex >= 0 &&
        seatIndex < seats.length
      ) {
        // Parse amenities data
        const amenities = params.amenities ? JSON.parse(params.amenities) : [];
        const pendingAmenities = params.pendingAmenities
          ? JSON.parse(params.pendingAmenities)
          : [];
        const hasUnsavedAmenityChanges =
          params.hasUnsavedAmenityChanges === "true";

        // Update the seat with note and amenities
        const newSeats = [...seats];
        newSeats[seatIndex] = {
          ...newSeats[seatIndex],
          isSpecial: (params.note || "").length > 0,
          note: params.note || "",
          amenities: amenities,
          pendingAmenities: pendingAmenities,
          hasUnsavedAmenityChanges: hasUnsavedAmenityChanges,
        };
        setValue("seats", newSeats);

        // Clear params after processing
        setTimeout(() => {
          router.setParams({
            seatIndex: undefined,
            action: undefined,
            note: undefined,
          });
        }, 100);
      }
    }
  }, [
    params.seatIndex,
    params.note,
    params.action,
    params.amenities,
    params.pendingAmenities,
    params.hasUnsavedAmenityChanges,
    seats,
    totalSeats,
    setValue,
  ]);

  // Create a preview room object compatible with RoomWithDetails type
  const previewRoom = useMemo(() => {
    return {
      id: "preview",
      company_id: null,
      name: name || "Preview Room",
      description: description || null,
      type: meeting ? ("meeting" as const) : ("workspace" as const),
      floor: floor || 1,
      wheelchair_accessible: wheelchair || false,
      has_elevator: elevator || false,
      pet_friendly: petFriendly || false,
      published: false,
      capacity: totalSeats,
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      seats: seats.map((seat, index) => ({
        id: `preview-seat-${index}`,
        room_id: "preview",
        number: seat.number,
        note: seat.note || null,
        status: "available" as const,
        deleted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reservation: [],
        // Pass through pendingAmenities and unsaved changes flag for visual indicator
        pendingAmenities: seat.pendingAmenities,
        hasUnsavedAmenityChanges: seat.hasUnsavedAmenityChanges,
      })),
    };
  }, [
    name,
    description,
    meeting,
    floor,
    wheelchair,
    elevator,
    petFriendly,
    totalSeats,
    seats,
  ]);

  const handleIncrementSeats = () => {
    const newTotal = totalSeats + 1;
    setValue("totalSeats", newTotal);

    // Add a new seat
    const newSeats = [
      ...seats,
      { number: newTotal, isSpecial: false, note: "" },
    ];
    setValue("seats", newSeats);
  };

  const handleSeatPress = (index: number) => {
    const seat = seats[index];
    router.push({
      pathname: "/(tabs)/rooms/seat/[id]" as any,
      params: {
        id: index.toString(),
        note: seat?.note || "",
        totalSeats: totalSeats.toString(),
        amenities: JSON.stringify(seat?.amenities || []),
        pendingAmenities: JSON.stringify(seat?.pendingAmenities || []),
        hasUnsavedAmenityChanges: seat?.hasUnsavedAmenityChanges
          ? "true"
          : "false",
      },
    });
  };

  // Initialize seats array if needed
  React.useEffect(() => {
    if (seats.length !== totalSeats) {
      const newSeats = Array.from({ length: totalSeats }, (_, i) => {
        const existingSeat = seats[i];
        return existingSeat || { number: i + 1, isSpecial: false, note: "" };
      });
      setValue("seats", newSeats);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSeats, seats.length, setValue]);

  const handleAddSeat = () => {
    if (totalSeats < 120) {
      handleIncrementSeats();
    }
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        <View className="p-8 pb-24">
          {/* Room Preview */}
          <Room
            room={previewRoom}
            showActions={false}
            editMode={true}
            onSeatPress={handleSeatPress}
          />
        </View>
      </ScrollView>

      {/* FAB to add seats */}
      {totalSeats < 120 && <FAB onPress={handleAddSeat} />}
    </View>
  );
}
