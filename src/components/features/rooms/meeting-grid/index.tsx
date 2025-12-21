import { User } from "@/src/types/user";
import React from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";
import { Seat as SeatType } from "@/src/types/room";
import PaginationIndicator from "@/src/components/pagination-indicator";
import Seat from "../seat";

interface SeatInfo {
  seat: SeatType;
  isOccupied: boolean;
  user?: User;
  seatIndex: number;
}

interface SeatData {
  seatCount: number;
  seatsPerPage: number;
  totalPages: number;
  hasMultiplePages: boolean;
}

interface MeetingGridProps {
  seats: SeatType[];
  processSeat: (index: number) => SeatInfo | null;
  seatData: SeatData;
  currentPage: number;
  containerWidth: number;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onLayout: (event: { nativeEvent: { layout: { width: number } } }) => void;
  editMode?: boolean;
  onSeatPress?: (seatIndex: number) => void;
}

export default function MeetingGrid({
  processSeat,
  seatData,
  currentPage,
  containerWidth,
  onScroll,
  onLayout,
  editMode = false,
  onSeatPress,
}: MeetingGridProps) {
  const renderSingleMeetingPage = (pageIndex: number) => {
    const startIndex = pageIndex * seatData.seatsPerPage;
    const endIndex = Math.min(
      startIndex + seatData.seatsPerPage,
      seatData.seatCount
    );
    const seatsOnThisPage = endIndex - startIndex;

    const positions = {
      top: [] as number[],
      right: null as number | null,
      bottom: [] as number[],
      left: null as number | null,
    };

    // Layout based on seat count:
    // 1 seat: top center
    // 2 seats: top center, bottom center
    // 3 seats: top center, left, right
    // 4 seats: top center, left, right, bottom center
    // 5 seats: 3 top, left, right
    // 6 seats: 3 top, 3 bottom
    // 7 seats: 3 top, right, 3 bottom
    // 8 seats: 3 top, left, right, 3 bottom

    if (seatsOnThisPage === 1) {
      // 0 1 0 / 0 T 0 / 0 0 0
      positions.top = [startIndex];
    } else if (seatsOnThisPage === 2) {
      // 0 1 0 / 0 T 0 / 0 1 0
      positions.top = [startIndex];
      positions.bottom = [startIndex + 1];
    } else if (seatsOnThisPage === 3) {
      // 0 1 0 / 1 T 1 / 0 0 0
      positions.top = [startIndex];
      positions.left = startIndex + 1;
      positions.right = startIndex + 2;
    } else if (seatsOnThisPage === 4) {
      // 0 1 0 / 1 T 1 / 0 1 0
      positions.top = [startIndex];
      positions.left = startIndex + 1;
      positions.right = startIndex + 2;
      positions.bottom = [startIndex + 3];
    } else if (seatsOnThisPage === 5) {
      // 1 1 1 / 1 T 1 / 0 0 0
      positions.top = [startIndex, startIndex + 1, startIndex + 2];
      positions.left = startIndex + 3;
      positions.right = startIndex + 4;
    } else if (seatsOnThisPage === 6) {
      // 1 1 1 / 0 T 0 / 1 1 1
      positions.top = [startIndex, startIndex + 1, startIndex + 2];
      positions.bottom = [startIndex + 3, startIndex + 4, startIndex + 5];
    } else if (seatsOnThisPage === 7) {
      // 1 1 1 / 1 T 1 / 1 0 1
      positions.top = [startIndex, startIndex + 1, startIndex + 2];
      positions.left = startIndex + 3;
      positions.right = startIndex + 4;
      positions.bottom = [startIndex + 5, startIndex + 6];
    } else if (seatsOnThisPage >= 8) {
      // 1 1 1 / 1 T 1 / 1 1 1
      positions.top = [startIndex, startIndex + 1, startIndex + 2];
      positions.left = startIndex + 3;
      positions.right = startIndex + 4;
      positions.bottom = [startIndex + 5, startIndex + 6, startIndex + 7];
    }

    const renderSeatsAtPositions = (seatIndices: number[]) => {
      return seatIndices.map((seatIndex) => {
        const seatInfo = processSeat(seatIndex);
        return seatInfo ? (
          <Seat
            key={`seat-${seatIndex}`}
            seat={seatInfo.seat}
            isOccupied={seatInfo.isOccupied}
            user={seatInfo.user}
            seatIndex={seatIndex}
            roomType="meeting"
            editMode={editMode}
            onPress={onSeatPress ? () => onSeatPress(seatIndex) : undefined}
          />
        ) : null;
      });
    };

    const renderSingleSeat = (seatIndex: number | null) => {
      if (seatIndex === null) return null;
      const seatInfo = processSeat(seatIndex);
      return seatInfo ? (
        <Seat
          key={`seat-${seatIndex}`}
          seat={seatInfo.seat}
          isOccupied={seatInfo.isOccupied}
          user={seatInfo.user}
          seatIndex={seatIndex}
          roomType="meeting"
          editMode={editMode}
          onPress={onSeatPress ? () => onSeatPress(seatIndex) : undefined}
        />
      ) : null;
    };

    return (
      <View className="items-center w-full">
        {/* Top row of seats */}
        <View className="flex-row justify-center mb-3">
          {renderSeatsAtPositions(positions.top)}
        </View>

        {/* Middle row with table and side seats */}
        <View className="flex-row items-center justify-center mb-3">
          {/* Left seat */}
          <View className="mr-4">{renderSingleSeat(positions.left)}</View>

          {/* Conference table */}
          <View className="w-40 h-20 bg-primary-900 rounded-lg border-0 shadow-sm border-gray-400" />

          {/* Right seat */}
          <View className="ml-4">{renderSingleSeat(positions.right)}</View>
        </View>

        {/* Bottom row of seats */}
        <View className="flex-row justify-center">
          {renderSeatsAtPositions(positions.bottom)}
        </View>
      </View>
    );
  };

  // Single page layout
  if (seatData.seatCount <= seatData.seatsPerPage) {
    return renderSingleMeetingPage(0);
  }

  // Multi-page layout
  return (
    <View className="w-full" onLayout={onLayout}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate="fast"
        bounces={false}
        onMomentumScrollEnd={onScroll}
        className="w-full"
      >
        {Array.from({ length: seatData.totalPages }, (_, pageIndex) => (
          <View
            key={`meeting-page-${pageIndex}`}
            style={{ width: containerWidth }}
          >
            {renderSingleMeetingPage(pageIndex)}
          </View>
        ))}
      </ScrollView>

      <PaginationIndicator
        currentPage={currentPage}
        totalPages={seatData.totalPages}
      />
    </View>
  );
}
