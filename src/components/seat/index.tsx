import { User } from "@/src/types/room";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Image, Text, View } from "react-native";
import Badge from "../ui/badge";

interface SeatProps {
  isOccupied: boolean;
  user?: User;
  seatIndex: number;
}

export default function Seat({ isOccupied, user, seatIndex }: SeatProps) {
  if (isOccupied && user) {
    return (
      <View key={`seat-${seatIndex}`} className="m-2 relative">
        <View className="w-16 h-16 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100">
          {user.avatar_url ? (
            <Image
              source={{ uri: user.avatar_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-primary items-center justify-center">
              <Text className="text-white text-lg font-bold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)}
              </Text>
            </View>
          )}
        </View>
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
        <View className="w-full h-full bg-white items-center justify-center">
          <MaterialCommunityIcons name="seat" size={24} />
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
