import React from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";
import { Seat as SeatType, User } from "../../types/room";
import PaginationIndicator from "../pagination-indicator";
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
}

export default function MeetingGrid({
  processSeat,
  seatData,
  currentPage,
  containerWidth,
  onScroll,
  onLayout,
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

    if (seatsOnThisPage === 2) {
      positions.top = [startIndex, startIndex + 1];
    } else if (seatsOnThisPage === 3) {
      positions.top = [startIndex];
      positions.right = startIndex + 1;
      positions.left = startIndex + 2;
    } else if (seatsOnThisPage === 4) {
      positions.top = [startIndex];
      positions.right = startIndex + 1;
      positions.bottom = [startIndex + 2];
      positions.left = startIndex + 3;
    } else if (seatsOnThisPage >= 5) {
      positions.top = [startIndex, startIndex + 1];
      if (seatsOnThisPage >= 5) positions.top.push(startIndex + 4);
      if (seatsOnThisPage >= 5) positions.right = startIndex + 2;

      const bottomSeats = [];
      if (seatsOnThisPage >= 7) bottomSeats.push(startIndex + 6);
      if (seatsOnThisPage >= 6) bottomSeats.push(startIndex + 5);
      if (seatsOnThisPage >= 4) bottomSeats.push(startIndex + 3);
      positions.bottom = bottomSeats.reverse();

      if (seatsOnThisPage >= 8) positions.left = startIndex + 7;
    }

    const renderSeatsAtPositions = (seatIndices: number[]) => {
      return seatIndices.map((seatIndex) => {
        const seatInfo = processSeat(seatIndex);
        return seatInfo ? (
          <Seat
            key={`seat-${seatIndex}`}
            isOccupied={seatInfo.isOccupied}
            user={seatInfo.user}
            seatIndex={seatIndex}
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
          isOccupied={seatInfo.isOccupied}
          user={seatInfo.user}
          seatIndex={seatIndex}
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
