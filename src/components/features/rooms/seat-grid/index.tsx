import WorkspaceGrid from "@/src/components/features/workspace/workspace-grid";
import Text from "@/src/components/ui/text";
import { useSeatGrid } from "@/src/hooks";
import { Seat } from "@/src/types/room";
import React from "react";
import { View } from "react-native";
import MeetingGrid from "../meeting-grid";

interface SeatGridProps {
  seats: Seat[];
  meeting?: boolean;
  editMode?: boolean;
  onSeatPress?: (seatIndex: number) => void;
}

export default function SeatGrid({
  seats,
  meeting = false,
  editMode = false,
  onSeatPress,
}: SeatGridProps) {
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
          <Text variant="sm" className="text-gray">
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
          editMode={editMode}
          onSeatPress={onSeatPress}
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
          editMode={editMode}
          onSeatPress={onSeatPress}
        />
      )}
    </View>
  );
}
