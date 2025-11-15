import React from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";
import { Seat as SeatType } from "../../types/room";
import { User } from "../../types/user";
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

interface WorkspaceGridProps {
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

export default function WorkspaceGrid({
  processSeat,
  seatData,
  currentPage,
  containerWidth,
  onScroll,
  onLayout,
  editMode = false,
  onSeatPress,
}: WorkspaceGridProps) {
  const renderSinglePage = (pageIndex: number) => {
    const gridPositions = [];
    const startIndex = pageIndex * seatData.seatsPerPage;

    for (let row = 0; row < 3; row++) {
      const rowSeats = [];
      for (let col = 0; col < 4; col++) {
        const seatIndex = startIndex + (row * 4 + col);
        if (seatIndex < seatData.seatCount) {
          const seatInfo = processSeat(seatIndex);
          if (seatInfo) {
            rowSeats.push(
              <Seat
                key={`seat-${seatIndex}`}
                seat={seatInfo.seat}
                isOccupied={seatInfo.isOccupied}
                user={seatInfo.user}
                seatIndex={seatIndex}
                roomType="workspace"
                editMode={editMode}
                onPress={onSeatPress ? () => onSeatPress(seatIndex) : undefined}
              />
            );
          }
        } else {
          rowSeats.push(
            <View key={`empty-${seatIndex}`} className="w-16 h-16 m-2" />
          );
        }
      }
      gridPositions.push(
        <View
          key={`row-${row}-page-${pageIndex}`}
          className="flex-row justify-center"
        >
          {rowSeats}
        </View>
      );
    }

    return <View className="w-full">{gridPositions}</View>;
  };

  // Single page layout
  if (seatData.seatCount <= seatData.seatsPerPage) {
    return renderSinglePage(0);
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
          <View key={`page-${pageIndex}`} style={{ width: containerWidth }}>
            {renderSinglePage(pageIndex)}
          </View>
        ))}
      </ScrollView>

      <PaginationIndicator
        currentPage={currentPage}
        totalPages={seatData.totalPages}
        label="Page"
      />
    </View>
  );
}
