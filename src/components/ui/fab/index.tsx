import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface FABProps extends TouchableOpacityProps {
  onPress: () => void;
  icon?: string;
  size?: number;
  backgroundColor?: string;
  iconColor?: string;
}

export default function FAB({
  onPress,
  icon = "+",
  size = 16,
  backgroundColor = "bg-orange-500",
  iconColor = "text-white",
  className,
  style,
  ...props
}: FABProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`absolute bottom-8 right-8 ${backgroundColor} w-${size} h-${size} rounded-full items-center justify-center shadow-lg ${
        className || ""
      }`}
      style={[
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        style,
      ]}
      {...props}
    >
      <MaterialCommunityIcons name="plus-thick" size={24} color="white" />
    </TouchableOpacity>
  );
}
