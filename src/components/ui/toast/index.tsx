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
        return {
          backgroundColor: "#10B981",
          borderColor: "#059669",
        };
      case "error":
        return {
          backgroundColor: "#EF4444",
          borderColor: "#DC2626",
        };
      case "info":
        return {
          backgroundColor: "#3B82F6",
          borderColor: "#2563EB",
        };
      default:
        return {
          backgroundColor: "#10B981",
          borderColor: "#059669",
        };
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

  const toastStyles = getToastStyles();

  return (
    <View className="absolute top-0 left-0 right-0 z-50 px-4 pt-32">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY }],
          backgroundColor: toastStyles.backgroundColor,
          borderColor: toastStyles.borderColor,
          borderWidth: 1,
          borderRadius: 8,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
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
