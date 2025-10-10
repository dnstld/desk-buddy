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
    const seatsPerPage = meeting ? 8 : 12;
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
      const isOccupied = seat?.reservations.length > 0;
      const user = seat?.reservations[0]?.user;

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

  const handleScroll = (event: any) => {
    const pageIndex = Math.round(
      event.nativeEvent.contentOffset.x / containerWidth
    );
    setCurrentPage(pageIndex);
  };

  const handleLayout = (event: any) => {
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
