import { Seat } from "@/src/types/room";
import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

interface SeatGridProps {
  seats: Seat[];
  meeting?: boolean;
}

export default function SeatGrid({ seats, meeting = false }: SeatGridProps) {
  const seatCount = seats.length;
  const [currentPage, setCurrentPage] = useState(0);
  const [containerWidth, setContainerWidth] = useState(350); // Default width

  // Calculate pagination for workspaces
  const seatsPerPage = 12; // 4x3 grid
  const totalPages = Math.ceil(seatCount / seatsPerPage);

  const renderSeat = (index: number) => {
    if (index >= seatCount) return null;

    const seat = seats[index];
    const isOccupied = seat?.reservations.length > 0;
    const user = seat?.reservations[0]?.user;

    if (isOccupied && user) {
      // Show user avatar
      return (
        <View
          key={`seat-${index}`}
          className="w-16 h-16 rounded-full m-2 border-4 border-gray-300 overflow-hidden bg-gray-100"
        >
          {user.avatar_url ? (
            <Image
              source={{ uri: user.avatar_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-blue-500 items-center justify-center">
              <Text className="text-white text-sm font-bold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)}
              </Text>
            </View>
          )}
        </View>
      );
    } else {
      // Show empty seat
      return (
        <View
          key={`seat-${index}`}
          className="w-16 h-16 rounded-full m-2 border-4 border-dashed border-gray-300 bg-gray-50 items-center justify-center"
        >
          <View className="w-8 h-8 rounded-full bg-green-400" />
        </View>
      );
    }
  };

  const renderWorkspaceGrid = () => {
    // For workspaces with 12 or fewer seats, render single page
    if (seatCount <= seatsPerPage) {
      return renderSinglePage(0);
    }

    // For workspaces with more than 12 seats, render paginated view
    return (
      <View
        className="w-full"
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setContainerWidth(width);
        }}
      >
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          decelerationRate="fast"
          bounces={false}
          onMomentumScrollEnd={(event) => {
            const pageIndex = Math.round(
              event.nativeEvent.contentOffset.x / containerWidth
            );
            setCurrentPage(pageIndex);
          }}
          className="w-full"
        >
          {Array.from({ length: totalPages }, (_, pageIndex) => (
            <View key={`page-${pageIndex}`} style={{ width: containerWidth }}>
              {renderSinglePage(pageIndex)}
            </View>
          ))}
        </ScrollView>

        {/* Page indicators */}
        {totalPages > 1 && (
          <View className="flex-row justify-center items-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <View
                key={`indicator-${index}`}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index === currentPage ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
            <Text className="text-xs text-gray-500 ml-2">
              Page {currentPage + 1} of {totalPages}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderSinglePage = (pageIndex: number) => {
    // Always render 4x3 grid (12 positions) per page
    const gridPositions = [];
    const startIndex = pageIndex * seatsPerPage;

    for (let row = 0; row < 3; row++) {
      const rowSeats = [];
      for (let col = 0; col < 4; col++) {
        const seatIndex = startIndex + (row * 4 + col);
        if (seatIndex < seatCount) {
          // Render actual seat
          rowSeats.push(renderSeat(seatIndex));
        } else {
          // Render empty placeholder
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

  const renderMeetingLayout = () => {
    // Meeting room: minimum 2 seats, maximum 8 seats per page around table
    if (seatCount < 2) {
      return (
        <View className="items-center w-full py-4">
          <Text className="text-gray-500 text-sm">
            Meeting room requires at least 2 seats
          </Text>
        </View>
      );
    }

    // For meeting rooms with more than 8 seats, use pagination
    if (seatCount > 8) {
      const meetingPages = Math.ceil(seatCount / 8);

      return (
        <View
          className="w-full"
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setContainerWidth(width);
          }}
        >
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            decelerationRate="fast"
            bounces={false}
            onMomentumScrollEnd={(event) => {
              const pageIndex = Math.round(
                event.nativeEvent.contentOffset.x / containerWidth
              );
              setCurrentPage(pageIndex);
            }}
            className="w-full"
          >
            {Array.from({ length: meetingPages }, (_, pageIndex) => (
              <View
                key={`meeting-page-${pageIndex}`}
                style={{ width: containerWidth }}
              >
                {renderSingleMeetingPage(pageIndex)}
              </View>
            ))}
          </ScrollView>

          {/* Page indicators for meeting rooms */}
          {meetingPages > 1 && (
            <View className="flex-row justify-center items-center mt-4 space-x-2">
              {Array.from({ length: meetingPages }, (_, index) => (
                <View
                  key={`meeting-indicator-${index}`}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === currentPage ? "bg-purple-500" : "bg-gray-300"
                  }`}
                />
              ))}
              <Text className="text-xs text-gray-500 ml-2">
                Table {currentPage + 1} of {meetingPages}
              </Text>
            </View>
          )}
        </View>
      );
    }

    // For meeting rooms with 8 or fewer seats, render single page
    return renderSingleMeetingPage(0);
  };

  const renderSingleMeetingPage = (pageIndex: number) => {
    const startIndex = pageIndex * 8;
    const endIndex = Math.min(startIndex + 8, seatCount);
    const seatsOnThisPage = endIndex - startIndex;

    // Distribute seats around table positions for this page
    const getTopSeats = () => {
      const topSeats = [];
      const seatOffset = startIndex;

      if (seatsOnThisPage === 2) {
        // 2 seats: top-left and top-center
        topSeats.push(renderSeat(seatOffset + 0));
        topSeats.push(renderSeat(seatOffset + 1));
      } else if (seatsOnThisPage === 3) {
        // 3 seats: only top-center
        topSeats.push(renderSeat(seatOffset + 0));
      } else if (seatsOnThisPage === 4) {
        // 4 seats: only top-center
        topSeats.push(renderSeat(seatOffset + 0));
      } else {
        // 5+ seats: top-left, top-center, top-right
        topSeats.push(renderSeat(seatOffset + 0)); // top-left
        topSeats.push(renderSeat(seatOffset + 1)); // top-center
        if (seatsOnThisPage >= 5) topSeats.push(renderSeat(seatOffset + 4)); // top-right
      }
      return topSeats;
    };

    const getRightSeat = () => {
      const seatOffset = startIndex;
      if (seatsOnThisPage === 3) return renderSeat(seatOffset + 1); // 3 seats: right side
      if (seatsOnThisPage === 4) return renderSeat(seatOffset + 1); // 4 seats: right side
      if (seatsOnThisPage >= 5) return renderSeat(seatOffset + 2); // 5+ seats: right side
      return null;
    };

    const getBottomSeats = () => {
      const bottomSeats = [];
      const seatOffset = startIndex;

      if (seatsOnThisPage === 4) {
        // 4 seats: only bottom-center
        bottomSeats.push(renderSeat(seatOffset + 2));
      } else if (seatsOnThisPage >= 5) {
        // 5+ seats: follow original pattern
        if (seatsOnThisPage >= 7) bottomSeats.push(renderSeat(seatOffset + 6)); // bottom-left
        if (seatsOnThisPage >= 6) bottomSeats.push(renderSeat(seatOffset + 5)); // bottom-center
        if (seatsOnThisPage >= 4) bottomSeats.push(renderSeat(seatOffset + 3)); // bottom-right
        bottomSeats.reverse(); // Display left to right
      }
      return bottomSeats;
    };

    const getLeftSeat = () => {
      const seatOffset = startIndex;
      if (seatsOnThisPage === 3) return renderSeat(seatOffset + 2); // 3 seats: left side
      if (seatsOnThisPage === 4) return renderSeat(seatOffset + 3); // 4 seats: left side
      if (seatsOnThisPage >= 8) return renderSeat(seatOffset + 7); // 8 seats: left side
      return null;
    };

    return (
      <View className="items-center w-full">
        {/* Top row of seats around table */}
        <View className="flex-row justify-center mb-3">{getTopSeats()}</View>

        {/* Middle row with table and side seats */}
        <View className="flex-row items-center justify-center mb-3">
          {/* Left seat */}
          <View className="mr-4">{getLeftSeat()}</View>

          {/* Conference table */}
          <View className="w-40 h-20 bg-amber-100 rounded-lg border-4 border-amber-200 items-center justify-center mx-2">
            <Text className="text-sm text-amber-700 font-bold">Conference</Text>
            <Text className="text-xs text-amber-600">
              Table {pageIndex + 1}
            </Text>
          </View>

          {/* Right seat */}
          <View className="ml-4">{getRightSeat()}</View>
        </View>

        {/* Bottom row of seats around table */}
        <View className="flex-row justify-center">{getBottomSeats()}</View>
      </View>
    );
  };

  if (seatCount === 0) {
    return (
      <View className="items-center py-4 w-full">
        <View className="w-full h-8 bg-gray-100 rounded items-center justify-center">
          <Text className="text-gray-500 text-sm">No seats configured</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="py-3 w-full">
      {meeting ? renderMeetingLayout() : renderWorkspaceGrid()}
    </View>
  );
}
