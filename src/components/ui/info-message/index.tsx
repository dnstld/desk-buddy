import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Text, View } from "react-native";

interface InfoMessageProps {
  variant?: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

const variantStyles = {
  info: {
    container: "bg-blue-50 border-blue-200",
    icon: "#3B82F6",
    title: "text-blue-900",
    message: "text-blue-700",
  },
  success: {
    container: "bg-green-50 border-green-200",
    icon: "#10B981",
    title: "text-green-900",
    message: "text-green-700",
  },
  warning: {
    container: "bg-orange-50 border-orange-200",
    icon: "#F59E0B",
    title: "text-orange-900",
    message: "text-orange-700",
  },
  error: {
    container: "bg-red-50 border-red-200",
    icon: "#EF4444",
    title: "text-red-900",
    message: "text-red-700",
  },
};

export default function InfoMessage({
  variant = "info",
  title,
  message,
  icon = "information",
}: InfoMessageProps) {
  const styles = variantStyles[variant];

  return (
    <View className={`border rounded-lg p-4 ${styles.container}`}>
      <View className="flex-row items-start gap-3">
        <MaterialCommunityIcons name={icon} size={24} color={styles.icon} />
        <View className="flex-1">
          <Text className={`font-semibold mb-1 ${styles.title}`}>{title}</Text>
          <Text className={styles.message}>{message}</Text>
        </View>
      </View>
    </View>
  );
}
