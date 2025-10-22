import React from "react";
import { View, ViewProps } from "react-native";

interface BadgeProps extends ViewProps {
  variant?: "success" | "danger" | "warning" | "primary";
  size?: "sm" | "md" | "lg";
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  backgroundColor?: string;
  borderColor?: string;
}

const variantStyles = {
  success: {
    background: "bg-green-500",
    border: "border-white",
  },
  danger: {
    background: "bg-red-500",
    border: "border-white",
  },
  warning: {
    background: "bg-yellow-500",
    border: "border-white",
  },
  primary: {
    background: "bg-primary",
    border: "border-white",
  },
};

const sizeStyles = {
  sm: {
    size: "w-4 h-4",
    border: "border-2",
  },
  md: {
    size: "w-5 h-5",
    border: "border-2",
  },
  lg: {
    size: "w-6 h-6",
    border: "border-2",
  },
};

const positionStyles = {
  "top-right": "absolute top-0 right-0",
  "top-left": "absolute top-0 left-0",
  "bottom-right": "absolute bottom-0 right-0",
  "bottom-left": "absolute bottom-0 left-0",
};

export default function Badge({
  variant = "primary",
  size = "sm",
  position = "top-right",
  backgroundColor,
  borderColor,
  className,
  style,
  ...props
}: BadgeProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const positionStyle = positionStyles[position];

  const bgColor = backgroundColor || variantStyle.background;
  const border = borderColor || variantStyle.border;

  return (
    <View
      className={`${bgColor} ${border} ${sizeStyle.size} ${
        sizeStyle.border
      } ${positionStyle} rounded-full ${className || ""}`}
      style={[
        {
          zIndex: 10,
        },
        style,
      ]}
      {...props}
    />
  );
}
