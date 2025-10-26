import { colors } from "@/src/theme/colors";
import { User } from "@/src/types/user";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Text, View } from "react-native";
import Badge from "../ui/badge";

interface SeatProps {
  isOccupied: boolean;
  user?: User;
  seatIndex: number;
}

export default function Seat({ isOccupied, user, seatIndex }: SeatProps) {
  if (isOccupied && user) {
    const userName = user.name || "Unknown";

    return (
      <View key={`seat-${seatIndex}`} className="m-2 relative">
        <View className="w-16 h-16 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100">
          <View className="w-full h-full bg-primary items-center justify-center relative">
            <MaterialCommunityIcons
              name="monitor-account"
              size={24}
              color={colors.primary[100]}
            />
          </View>
        </View>
        <Text
          className="text-white text-xs text-center p-[1px] rounded-sm absolute bottom-0 right-0 w-full bg-background/50"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {userName}
        </Text>
        <Badge
          variant="danger"
          size="md"
          position="top-right"
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            zIndex: 20,
          }}
        />
      </View>
    );
  }

  return (
    <View key={`seat-${seatIndex}`} className="m-2 relative">
      <View className="w-16 h-16 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100">
        <View className="w-full h-full bg-primary-50 items-center justify-center">
          <MaterialCommunityIcons name="monitor" size={24} />
        </View>
      </View>
      <Badge
        variant="success"
        size="md"
        position="top-right"
        style={{
          position: "absolute",
          top: -2,
          right: -2,
          zIndex: 20,
        }}
      />
    </View>
  );
}
