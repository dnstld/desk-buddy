import { RoomWithDetails } from "@/src/types/room";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import SeatGrid from "./seat-grid";

interface RoomProps {
  room: RoomWithDetails;
}

export default function Room({ room }: RoomProps) {
  const {
    room_name,
    color,
    seats,
    meeting,
    description,
    floor,
    wheelchair,
    elevator,
  } = room;

  // Calculate room occupancy
  const { totalSeats, reservedSeats, percentOccupied, availableSeats } =
    useMemo(() => {
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

  const occupancyText = `${availableSeats} of ${totalSeats} seats available`;

  // Get room status
  const roomStatus = useMemo(() => {
    if (totalSeats === 0) return { label: "No seats", color: "bg-gray-400" };
    if (reservedSeats === 0)
      return { label: "Available", color: "bg-green-500" };
    if (reservedSeats === totalSeats)
      return { label: "Full", color: "bg-red-500" };
    return { label: "Partially occupied", color: "bg-yellow-500" };
  }, [totalSeats, reservedSeats]);

  return (
    <View className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
      {/* Header with progress bar */}
      <View className="p-4">
        {/* Room type and status badges */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View
              className={`px-2 py-1 rounded-full mr-2 ${
                meeting ? "bg-purple-100" : "bg-blue-100"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  meeting ? "text-purple-700" : "text-blue-700"
                }`}
              >
                {meeting ? "📋 Meeting" : "💼 Workspace"}
              </Text>
            </View>
            <View className={`px-2 py-1 rounded-full ${roomStatus.color}`}>
              <Text className="text-xs font-medium text-white">
                {roomStatus.label}
              </Text>
            </View>
          </View>
          <Text className="text-xs text-gray-500">Floor {floor}</Text>
        </View>

        {/* Progress bar */}
        <View className="bg-gray-200 h-2 rounded-full mb-3">
          <View
            className="h-2 rounded-full"
            style={{
              width: `${percentOccupied}%`,
              backgroundColor: color || "#3b82f6",
            }}
          />
        </View>

        {/* Room name with color indicator */}
        <View className="flex-row items-center mb-2">
          <View
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: color || "#3b82f6" }}
          />
          <Text
            className="text-lg font-bold leading-tight flex-1"
            style={{ color: color || "#000" }}
          >
            {room_name}
          </Text>
        </View>

        {/* Occupancy text */}
        <Text className="text-sm text-gray-600 mb-3">{occupancyText}</Text>

        {/* Description */}
        {description && (
          <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
            {description}
          </Text>
        )}

        {/* Seat visualization */}
        <View className="border-t border-gray-100 pt-3 mb-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-medium text-gray-700 mb-2">
              Seat Layout
            </Text>
            <View className="flex-row items-center">
              <View className="flex-row items-center mr-3">
                <View className="w-4 h-4 bg-green-400 rounded-full mr-1" />
                <Text className="text-xs text-gray-600">Available</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-4 h-4 bg-blue-500 rounded-full mr-1" />
                <Text className="text-xs text-gray-600">Occupied</Text>
              </View>
            </View>
          </View>
          <SeatGrid seats={seats} meeting={meeting} />
        </View>

        {/* Amenities */}
        {(wheelchair || elevator) && (
          <View className="flex-row items-center space-x-3 pt-2 border-t border-gray-100">
            {wheelchair && (
              <View className="flex-row items-center">
                <Text className="text-sm text-blue-600">♿</Text>
                <Text className="text-xs text-gray-600 ml-1">Accessible</Text>
              </View>
            )}
            {elevator && (
              <View className="flex-row items-center">
                <Text className="text-sm text-green-600">🛗</Text>
                <Text className="text-xs text-gray-600 ml-1">Elevator</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
