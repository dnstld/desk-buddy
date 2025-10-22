import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Pressable, Text, View } from "react-native";

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

const VARIANT_STYLES: Record<
  ButtonVariant,
  { container: string; text: string; iconColor: string }
> = {
  primary: {
    container: "bg-primary border-primary",
    text: "text-white",
    iconColor: "#FFFFFF",
  },
  "primary-outline": {
    container: "bg-transparent border-primary",
    text: "text-primary",
    iconColor: "#f78509",
  },
  secondary: {
    container: "bg-gray-600 border-gray-600",
    text: "text-white",
    iconColor: "#FFFFFF",
  },
  "secondary-outline": {
    container: "bg-transparent border-gray-300",
    text: "text-gray-600",
    iconColor: "#6B7280",
  },
  danger: {
    container: "bg-error border-error",
    text: "text-white",
    iconColor: "#FFFFFF",
  },
  "danger-outline": {
    container: "bg-transparent border-error",
    text: "text-error",
    iconColor: "#EF4444",
  },
  "danger-ghost": {
    container: "bg-transparent border-transparent",
    text: "text-error",
    iconColor: "#EF4444",
  },
  success: {
    container: "bg-success border-success",
    text: "text-white",
    iconColor: "#FFFFFF",
  },
  "success-outline": {
    container: "bg-transparent border-success",
    text: "text-success",
    iconColor: "#10B981",
  },
  ghost: {
    container: "bg-transparent border-transparent",
    text: "text-primary",
    iconColor: "#f78509",
  },
};

const SIZE_CONFIG = {
  sm: { container: "px-3 py-2 min-h-[36px]", text: "text-sm", icon: 16 },
  md: { container: "px-4 py-3 min-h-[44px]", text: "text-base", icon: 20 },
  lg: { container: "px-6 py-4 min-h-[52px]", text: "text-lg", icon: 24 },
} as const;

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
  const variantConfig = VARIANT_STYLES[variant];
  const sizeConfig = SIZE_CONFIG[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`
        flex-row items-center justify-center rounded-lg border
        ${variantConfig.container}
        ${sizeConfig.container}
        ${isDisabled ? "opacity-50" : ""}
        ${className}
      `.trim()}
    >
      <View className="flex-row items-center justify-center gap-2">
        {loading ? (
          <MaterialCommunityIcons
            name="loading"
            size={sizeConfig.icon}
            color={variantConfig.iconColor}
          />
        ) : (
          icon && (
            <MaterialCommunityIcons
              name={icon}
              size={sizeConfig.icon}
              color={variantConfig.iconColor}
            />
          )
        )}

        {title && (
          <Text
            className={`
              font-medium
              ${variantConfig.text}
              ${sizeConfig.text}
            `.trim()}
          >
            {title}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
