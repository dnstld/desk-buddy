import React from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

type ChipVariant = "primary" | "warning" | "success" | "danger" | "outline";
type ChipSize = "sm" | "md" | "lg";

interface ChipProps extends TouchableOpacityProps {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  onPress?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
}

const variantStyles = {
  primary: {
    background: "bg-primary-100",
    text: "text-primary-500",
    border: "",
  },
  warning: {
    background: "bg-yellow-100",
    text: "text-yellow-700",
    border: "",
  },
  success: {
    background: "bg-green-100",
    text: "text-green-700",
    border: "",
  },
  danger: {
    background: "bg-red-100",
    text: "text-red-700",
    border: "",
  },
  outline: {
    background: "bg-transparent",
    text: "text-black",
    border: "border border-gray-200",
  },
};

const sizeStyles = {
  sm: {
    padding: "px-2 py-1",
    text: "text-xs",
  },
  md: {
    padding: "px-3 py-1.5",
    text: "text-sm",
  },
  lg: {
    padding: "px-4 py-2",
    text: "text-base",
  },
};

export default function Chip({
  label,
  variant = "primary",
  size = "sm",
  onPress,
  disabled = false,
  icon,
  backgroundColor,
  textColor,
  className,
  style,
  ...props
}: ChipProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  const bgColor = backgroundColor || variantStyle.background;
  const textColorClass = textColor || variantStyle.text;
  const borderClass = variantStyle.border;

  const chipContent = (
    <>
      {icon && <Text className="mr-1">{icon}</Text>}
      <Text className={`${sizeStyle.text} font-medium ${textColorClass}`}>
        {label}
      </Text>
    </>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className={`${bgColor} ${borderClass} ${
          sizeStyle.padding
        } rounded-full flex-row items-center ${disabled ? "opacity-50" : ""} ${
          className || ""
        }`}
        style={style}
        disabled={disabled}
        {...props}
      >
        {chipContent}
      </TouchableOpacity>
    );
  }

  return (
    <View
      className={`${bgColor} ${borderClass} ${
        sizeStyle.padding
      } rounded-full flex-row items-center ${disabled ? "opacity-50" : ""} ${
        className || ""
      }`}
      style={style}
    >
      {chipContent}
    </View>
  );
}
