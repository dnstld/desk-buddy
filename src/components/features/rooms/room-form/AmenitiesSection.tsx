import { colors } from "@/src/theme/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Switch, Text, View } from "react-native";

interface AmenityToggleProps {
  icon: string;
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

function AmenityToggle({
  icon,
  title,
  description,
  value,
  onChange,
}: AmenityToggleProps) {
  return (
    <View className="flex-row items-center justify-between p-4 bg-white rounded-lg">
      <View className="flex-row items-center gap-4 flex-1">
        <MaterialCommunityIcons
          name={icon as any}
          size={24}
          color={colors.gray.DEFAULT}
        />
        <View className="flex-1">
          <Text className="text-base font-medium">{title}</Text>
          <Text className="text-sm text-gray">{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{
          false: colors.gray[300],
          true: colors.primary[200],
        }}
        thumbColor={value ? colors.primary.DEFAULT : colors.gray[50]}
      />
    </View>
  );
}

interface AmenitiesSectionProps {
  wheelchair: boolean;
  elevator: boolean;
  petFriendly: boolean;
  onWheelchairChange: (value: boolean) => void;
  onElevatorChange: (value: boolean) => void;
  onPetFriendlyChange: (value: boolean) => void;
}

export default function AmenitiesSection({
  wheelchair,
  elevator,
  petFriendly,
  onWheelchairChange,
  onElevatorChange,
  onPetFriendlyChange,
}: AmenitiesSectionProps) {
  return (
    <View className="gap-4">
      <Text className="text-base font-semibold text-gray-900">Amenities</Text>

      <AmenityToggle
        icon="wheelchair-accessibility"
        title="Wheelchair Accessible"
        description="Accessible for wheelchair users"
        value={wheelchair}
        onChange={onWheelchairChange}
      />

      <AmenityToggle
        icon="elevator"
        title="Elevator Access"
        description="Accessible by elevator"
        value={elevator}
        onChange={onElevatorChange}
      />

      <AmenityToggle
        icon="dog-side"
        title="Pet Friendly"
        description="Allows pets in the room"
        value={petFriendly}
        onChange={onPetFriendlyChange}
      />
    </View>
  );
}
