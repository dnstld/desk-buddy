import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect } from "react";
import { Animated, Text, View } from "react-native";

type ToastType = "success" | "error" | "info";

export interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
}

export default function Toast({
  visible,
  message,
  type = "success",
  duration = 3000,
  onHide,
}: ToastProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-100)).current;

  const hideToast = React.useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  }, [fadeAnim, translateY, onHide]);

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, fadeAnim, translateY, hideToast]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 border-green-600";
      case "error":
        return "bg-red-500 border-red-600";
      case "info":
        return "bg-blue-500 border-blue-600";
      default:
        return "bg-green-500 border-green-600";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "check-circle";
      case "error":
        return "alert-circle";
      case "info":
        return "information";
      default:
        return "check-circle";
    }
  };

  if (!visible) return null;

  return (
    <View className="absolute top-0 left-0 right-0 z-50 px-4 pt-12">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY }],
        }}
        className={`
          flex-row items-center p-4 rounded-lg border shadow-lg
          ${getToastStyles()}
        `.trim()}
      >
        <MaterialCommunityIcons
          name={getIcon()}
          size={24}
          color="white"
          style={{ marginRight: 12 }}
        />
        <Text className="text-white font-medium flex-1 text-base">
          {message}
        </Text>
      </Animated.View>
    </View>
  );
}
