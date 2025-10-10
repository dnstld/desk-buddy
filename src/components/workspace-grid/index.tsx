import React from "react";
import { ScrollView, View } from "react-native";
import PaginationIndicator from "../pagination-indicator";
import Seat from "../seat";

interface WorkspaceGridProps {
  seats: any[];
  processSeat: (index: number) => any;
  seatData: {
    seatCount: number;
    seatsPerPage: number;
    totalPages: number;
    hasMultiplePages: boolean;
  };
  currentPage: number;
  containerWidth: number;
  onScroll: (event: any) => void;
  onLayout: (event: any) => void;
}

export default function WorkspaceGrid({
  processSeat,
  seatData,
  currentPage,
  containerWidth,
  onScroll,
  onLayout,
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
                isOccupied={seatInfo.isOccupied}
                user={seatInfo.user}
                seatIndex={seatIndex}
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
