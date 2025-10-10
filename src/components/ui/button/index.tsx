import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type ButtonVariant =
  | "primary"
  | "primary-outline"
  | "secondary"
  | "secondary-outline"
  | "danger"
  | "danger-outline"
  | "danger-ghost"
  | "success"
  | "success-outline"
  | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  disabled = false,
  loading = false,
  className = "",
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-primary-500 border-primary-500";
      case "primary-outline":
        return "bg-transparent border-primary-500";
      case "secondary":
        return "bg-gray-500 border-gray-500";
      case "secondary-outline":
        return "bg-transparent border-gray-500";
      case "danger":
        return "bg-red-500 border-red-500";
      case "danger-outline":
        return "bg-transparent border-red-500";
      case "danger-ghost":
        return "bg-transparent border-transparent";
      case "success":
        return "bg-green-500 border-green-500";
      case "success-outline":
        return "bg-transparent border-green-500";
      case "ghost":
        return "bg-transparent border-transparent";
      default:
        return "bg-primary-500 border-primary-500";
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case "primary":
      case "secondary":
      case "danger":
      case "success":
        return "text-white";
      case "primary-outline":
      case "ghost":
        return "text-primary-500";
      case "secondary-outline":
        return "text-gray-500";
      case "danger-outline":
        return "text-red-500";
      case "danger-ghost":
        return "text-red-500";
      case "success-outline":
        return "text-green-500";
      default:
        return "text-white";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3 py-2 min-h-[36px]";
      case "md":
        return "px-4 py-3 min-h-[44px]";
      case "lg":
        return "px-6 py-4 min-h-[52px]";
      default:
        return "px-4 py-3 min-h-[44px]";
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "md":
        return "text-base";
      case "lg":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return 16;
      case "md":
        return 20;
      case "lg":
        return 24;
      default:
        return 20;
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "primary":
      case "secondary":
      case "danger":
      case "success":
        return "white";
      case "primary-outline":
      case "ghost":
        return "#3B82F6"; // primary-500
      case "secondary-outline":
        return "#6B7280"; // gray-500
      case "danger-outline":
        return "#EF4444"; // red-500
      case "danger-ghost":
        return "#EF4444"; // red-500
      case "success-outline":
        return "#10B981"; // green-500
      default:
        return "white";
    }
  };

  const getDisabledStyles = () => {
    if (disabled || loading) {
      return "opacity-50";
    }
    return "";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        flex-row items-center justify-center rounded-lg border
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${getDisabledStyles()}
        ${className}
      `.trim()}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-center gap-2">
        {icon && !loading && (
          <MaterialCommunityIcons
            name={icon}
            size={getIconSize()}
            color={getIconColor()}
          />
        )}

        {loading && (
          <MaterialCommunityIcons
            name="loading"
            size={getIconSize()}
            color={getIconColor()}
          />
        )}

        <Text
          className={`
            font-medium
            ${getTextStyles()}
            ${getTextSizeStyles()}
          `.trim()}
        >
          {loading ? "Loading..." : title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
