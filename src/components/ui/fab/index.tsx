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
      className={`absolute bottom-4 right-4 bg-secondary w-20 h-20 rounded-full items-center justify-center shadow-lg ${
        className || ""
      }`}
      {...props}
    >
      <MaterialCommunityIcons name="plus-thick" size={32} color="white" />
    </TouchableOpacity>
  );
}
