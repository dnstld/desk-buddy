import { colors } from "@/src/theme/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface RoomTypeSelectorProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function RoomTypeSelector({
  value,
  onChange,
}: RoomTypeSelectorProps) {
  return (
    <View className="gap-4">
      <Text className="text-base font-semibold">Room Type</Text>
      <View className="flex-row gap-4">
        <TouchableOpacity
          onPress={() => onChange(false)}
          className={`
            flex-1 flex-row items-center justify-center gap-2 p-4 rounded-lg border-2 bg-white
            ${!value ? "border-primary" : "border-gray-200"}
          `.trim()}
        >
          <MaterialCommunityIcons
            name="account"
            size={24}
            color={!value ? colors.primary.DEFAULT : colors.gray.DEFAULT}
          />
          <Text
            className={`
              font-medium
              ${!value ? "text-primary" : "text-base"}
            `.trim()}
          >
            Workspace
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onChange(true)}
          className={`
            flex-1 flex-row items-center justify-center gap-2 p-4 rounded-lg border-2 bg-white
            ${value ? "border-primary" : "border-gray-200"}
          `.trim()}
        >
          <MaterialCommunityIcons
            name="account-group"
            size={24}
            color={value ? colors.primary.DEFAULT : colors.gray.DEFAULT}
          />
          <Text
            className={`
              font-medium
              ${value ? "text-primary" : "text-base"}
            `.trim()}
          >
            Meeting Room
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
