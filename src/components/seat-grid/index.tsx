import { useSeatGrid } from "@/src/hooks";
import { Seat } from "@/src/types/room";
import React from "react";
import { Text, View } from "react-native";
import MeetingGrid from "../meeting-grid";
import WorkspaceGrid from "../workspace-grid";

interface SeatGridProps {
  seats: Seat[];
  meeting?: boolean;
}

export default function SeatGrid({ seats, meeting = false }: SeatGridProps) {
  const {
    currentPage,
    containerWidth,
    seatCount,
    seatsPerPage,
    totalPages,
    hasMultiplePages,
    processSeat,
    handleScroll,
    handleLayout,
  } = useSeatGrid({ seats, meeting });

  if (seatCount === 0) {
    return (
      <View className="items-center py-4 w-full">
        <View className="w-full h-8 bg-gray-100 rounded items-center justify-center">
          <Text className="text-gray text-sm">
            Oops! Seats failed to load. Try again later or reload the app.
          </Text>
        </View>
      </View>
    );
  }

  const seatData = {
    seatCount,
    seatsPerPage,
    totalPages,
    hasMultiplePages,
  };

  return (
    <View className="py-3 w-full">
      {meeting ? (
        <MeetingGrid
          seats={seats}
          processSeat={processSeat}
          seatData={seatData}
          currentPage={currentPage}
          containerWidth={containerWidth}
          onScroll={handleScroll}
          onLayout={handleLayout}
        />
      ) : (
        <WorkspaceGrid
          seats={seats}
          processSeat={processSeat}
          seatData={seatData}
          currentPage={currentPage}
          containerWidth={containerWidth}
          onScroll={handleScroll}
          onLayout={handleLayout}
        />
      )}
    </View>
  );
}
