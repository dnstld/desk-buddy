import Text from "@/src/components/ui/text";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Modal, View } from "react-native";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../../tailwind.config.js";
import Button from "../button";

const fullConfig = resolveConfig(tailwindConfig);
const theme = fullConfig.theme;

export interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "danger" | "success";
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmationDialog({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  icon,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmationDialogProps) {
  const getIconColor = () => {
    switch (confirmVariant) {
      case "danger":
        return theme?.colors?.red?.[500] || "#EF4444";
      case "success":
        return theme?.colors?.green?.[500] || "#10B981";
      case "primary":
      default:
        return theme?.colors?.blue?.[500] || "#3B82F6";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
          {/* Icon and Title */}
          <View className="items-center mb-4">
            {icon && (
              <View className="mb-3">
                <MaterialCommunityIcons
                  name={icon}
                  size={32}
                  color={getIconColor()}
                />
              </View>
            )}
            <Text variant="xl" className="font-bold text-gray-900 text-center">
              {title}
            </Text>
          </View>

          {/* Message */}
          <Text className="text-gray-600 text-center mb-6 leading-relaxed">
            {message}
          </Text>

          {/* Action Buttons */}
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Button
                title={cancelText}
                variant="primary-outline"
                onPress={onCancel}
                disabled={loading}
              />
            </View>
            <View className="flex-1">
              <Button
                title={confirmText}
                variant={confirmVariant}
                onPress={onConfirm}
                loading={loading}
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
