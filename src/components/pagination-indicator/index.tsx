import React from "react";
import { Text, View } from "react-native";

interface PaginationIndicatorProps {
  currentPage: number;
  totalPages: number;
  label?: string;
}

export default function PaginationIndicator({
  currentPage,
  totalPages,
  label = "Page",
}: PaginationIndicatorProps) {
  if (totalPages <= 1) return null;

  return (
    <View className="flex-col items-center gap-2 mt-4">
      <View className="flex-row justify-center items-center space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <View
            key={`indicator-${index}`}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === currentPage ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </View>
      <Text className="text-xs">
        {label} {currentPage + 1} of {totalPages}
      </Text>
    </View>
  );
}
