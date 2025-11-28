import Text from "@/src/components/ui/text";
import { colors } from "@/src/theme/colors";
import { Seat as SeatType } from "@/src/types/room";
import { User } from "@/src/types/user";
import { Database } from "@/supabase/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Pressable, View } from "react-native";
import Badge from "../ui/badge";

interface SeatProps {
  seat: SeatType;
  isOccupied: boolean;
  user?: User;
  seatIndex: number;
  roomType?: Database["public"]["Enums"]["rooms"];
  editMode?: boolean;
  onPress?: () => void;
}

export default function Seat({
  seat,
  isOccupied,
  user,
  seatIndex,
  roomType = "workspace",
  editMode = false,
  onPress,
}: SeatProps) {
  const { note, pendingAmenities, hasUnsavedAmenityChanges } = seat;
  // Show yellow indicator if there are pending amenities OR any unsaved amenity changes
  const hasPendingChanges =
    hasUnsavedAmenityChanges ||
    (pendingAmenities && pendingAmenities.length > 0);

  const SeatWrapper = editMode && onPress ? Pressable : View;
  const wrapperProps = editMode && onPress ? { onPress } : {};

  if (isOccupied && user) {
    const userName = user.name || "Unknown";
    const iconName =
      roomType === "workspace" ? "monitor-account" : "account-check";

    return (
      <View className="m-2 relative">
        <View className="w-16 h-16 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100">
          <View className="w-full h-full bg-primary items-center justify-center relative">
            <MaterialCommunityIcons
              name={iconName}
              size={24}
              color={colors.primary[100]}
            />
          </View>
        </View>
        <Text
          variant="xs"
          className="text-white text-center p-[1px] rounded-sm absolute bottom-0 right-0 w-full bg-background/50"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {userName}
        </Text>
        {note && note.length > 0 && (
          <Badge
            variant="warning"
            size="md"
            position="top-right"
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              zIndex: 20,
            }}
          />
        )}
      </View>
    );
  }

  return (
    <SeatWrapper className="m-2 relative" {...wrapperProps}>
      <View
        className={`w-16 h-16 rounded-full border-2 overflow-hidden bg-gray-100 ${
          hasPendingChanges ? "border-yellow-500" : "border-gray-300"
        }`}
      >
        <View
          className={`w-full h-full items-center justify-center ${
            hasPendingChanges ? "bg-yellow-50" : "bg-primary-50"
          }`}
        >
          <MaterialCommunityIcons
            name="account-plus-outline"
            size={28}
            color={hasPendingChanges ? "#d97706" : colors.gray.DEFAULT}
          />
        </View>
      </View>
      {note && note.length > 0 && (
        <MaterialCommunityIcons
          name="information-variant-circle"
          size={18}
          color={colors.secondary[300]}
          className="bg-white absolute z-10 top-0 right-0 rounded-full shadow-sm"
        />
      )}
      {editMode && (
        <View className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
          <MaterialCommunityIcons name="pencil" size={12} color="white" />
        </View>
      )}
      {hasPendingChanges && (
        <View className="absolute -top-1 -right-1 bg-yellow-500 rounded-full w-5 h-5 items-center justify-center border-2 border-white">
          <MaterialCommunityIcons name="clock-fast" size={12} color="white" />
        </View>
      )}
    </SeatWrapper>
  );
}
