import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface FABProps extends TouchableOpacityProps {
  onPress: () => void;
}

export default function FAB({ onPress, className, ...props }: FABProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`absolute bottom-4 right-4 bg-primary w-16 h-16 rounded-full items-center justify-center shadow-lg ${
        className || ""
      }`}
      {...props}
    >
      <MaterialCommunityIcons name="plus-thick" size={24} color="white" />
    </TouchableOpacity>
  );
}
