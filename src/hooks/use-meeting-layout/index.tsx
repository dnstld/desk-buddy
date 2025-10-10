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
      // 5+ seats arrangement
      positions.top = [startIndex, startIndex + 1];
      if (seatsOnThisPage >= 5) positions.top.push(startIndex + 4);
      if (seatsOnThisPage >= 5) positions.right = startIndex + 2;

      // Bottom seats (reverse order for left-to-right display)
      const bottomSeats = [];
      if (seatsOnThisPage >= 7) bottomSeats.push(startIndex + 6);
      if (seatsOnThisPage >= 6) bottomSeats.push(startIndex + 5);
      if (seatsOnThisPage >= 4) bottomSeats.push(startIndex + 3);
      positions.bottom = bottomSeats.reverse();

      if (seatsOnThisPage >= 8) positions.left = startIndex + 7;
    }

    return {
      seatsOnThisPage,
      positions,
      isValidMeeting: seatsOnThisPage >= 2,
    };
  }, [pageIndex, seatsPerPage, totalSeats]);

  return layoutData;
}
