import React from "react";
import { Text, View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
}

export default function Header({
  title,
  subtitle,
  backgroundColor = "bg-primary-500",
  titleColor = "text-white",
  subtitleColor = "text-blue-100",
  className,
  style,
  ...props
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={`${backgroundColor} px-4 border-b border-blue-600 ${
        className || ""
      }`}
      style={[
        {
          paddingTop: insets.top + 12,
          paddingBottom: 12,
        },
        style,
      ]}
      {...props}
    >
      <Text className={`text-2xl font-bold ${titleColor}`}>{title}</Text>
      {subtitle && (
        <Text className={`text-sm ${subtitleColor} mt-1`}>{subtitle}</Text>
      )}
    </View>
  );
}
