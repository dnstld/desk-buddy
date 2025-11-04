import { useMemo } from "react";

interface UseMeetingLayoutProps {
  pageIndex: number;
  seatsPerPage: number;
  totalSeats: number;
}

export function useMeetingLayout({
  pageIndex,
  seatsPerPage,
  totalSeats,
}: UseMeetingLayoutProps) {
  const layoutData = useMemo(() => {
    const startIndex = pageIndex * seatsPerPage;
    const endIndex = Math.min(startIndex + seatsPerPage, totalSeats);
    const seatsOnThisPage = endIndex - startIndex;

    // Define seat positions based on count
    // Layout based on seat count:
    // 1 seat: top center
    // 2 seats: top center, bottom center
    // 3 seats: top center, left, right
    // 4 seats: top center, left, right, bottom center
    // 5 seats: 3 top, left, right
    // 6 seats: 3 top, 3 bottom
    // 7 seats: 3 top, right, 3 bottom
    // 8 seats: 3 top, left, right, 3 bottom
    const positions = {
      top: [] as number[],
      right: null as number | null,
      bottom: [] as number[],
      left: null as number | null,
    };

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

    return {
      seatsOnThisPage,
      positions,
      isValidMeeting: seatsOnThisPage >= 1,
    };
  }, [pageIndex, seatsPerPage, totalSeats]);

  return layoutData;
}
