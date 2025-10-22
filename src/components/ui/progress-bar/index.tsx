import React from "react";
import { View, ViewProps } from "react-native";

interface ProgressBarProps extends ViewProps {
  progress: number; // 0 to 100
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  rounded?: boolean;
}

export default function ProgressBar({
  progress,
  height = 4,
  backgroundColor = "bg-gray-200",
  progressColor = "bg-primary",
  rounded = true,
  className,
  style,
  ...props
}: ProgressBarProps) {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const roundedClass = rounded ? "rounded-full" : "";

  return (
    <View
      className={`${backgroundColor} ${roundedClass} ${className || ""}`}
      style={[{ height }, style]}
      {...props}
    >
      <View
        className={`h-full ${roundedClass} ${progressColor}`}
        style={{
          width: `${clampedProgress}%`,
        }}
      />
    </View>
  );
}
