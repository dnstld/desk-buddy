import { SEATS_CONFIG } from "@/src/constants/config";
import { Seat } from "@/src/types/room";
import { useMemo, useState } from "react";

interface UseSeatGridProps {
  seats: Seat[];
  meeting?: boolean;
}

export function useSeatGrid({ seats, meeting = false }: UseSeatGridProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [containerWidth, setContainerWidth] = useState(350);

  const seatData = useMemo(() => {
    const seatCount = seats.length;
    const seatsPerPage = meeting
      ? SEATS_CONFIG.PER_PAGE.MEETING
      : SEATS_CONFIG.PER_PAGE.WORKSPACE;
    const totalPages = Math.ceil(seatCount / seatsPerPage);

    return {
      seatCount,
      seatsPerPage,
      totalPages,
      hasMultiplePages: totalPages > 1,
    };
  }, [seats.length, meeting]);

  // Process individual seat
  const processSeat = useMemo(() => {
    return (index: number) => {
      if (index >= seatData.seatCount) return null;

      const seat = seats[index];
      // Use 'reservation' (singular) to match database schema
      const isOccupied = !!(seat?.reservation && seat.reservation.length > 0);
      const user = seat?.reservation?.[0]?.user;

      return {
        seat,
        isOccupied,
        user,
        seatIndex: index,
      };
    };
  }, [seats, seatData.seatCount]);

  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const handleScroll = (event: {
    nativeEvent: { contentOffset: { x: number } };
  }) => {
    const pageIndex = Math.round(
      event.nativeEvent.contentOffset.x / containerWidth
    );
    setCurrentPage(pageIndex);
  };

  const handleLayout = (event: {
    nativeEvent: { layout: { width: number } };
  }) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  return {
    // State
    currentPage,
    containerWidth,

    // Data
    ...seatData,

    // Functions
    processSeat,
    handlePageChange,
    handleScroll,
    handleLayout,
  };
}
