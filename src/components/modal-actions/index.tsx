import React from "react";
import { View } from "react-native";
import Button from "../ui/button";

interface ModalActionsProps {
  onCancel?: () => void;
  onSubmit: () => void;
  cancelText?: string;
  submitText: string;
  submitVariant?: "primary" | "danger" | "success";
  submitIcon?: any;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function ModalActions({
  onCancel,
  onSubmit,
  cancelText = "Cancel",
  submitText,
  submitVariant = "primary",
  submitIcon = "content-save",
  isLoading = false,
  disabled = false,
}: ModalActionsProps) {
  return (
    <View className="p-8 border-t border-gray-200 bg-white">
      <View className="flex-row gap-4">
        {onCancel && (
          <View className="flex-1">
            <Button
              title={cancelText}
              onPress={onCancel}
              variant="secondary"
              icon="close"
              disabled={isLoading || disabled}
            />
          </View>
        )}
        <View className="flex-1">
          <Button
            title={submitText}
            onPress={onSubmit}
            loading={isLoading}
            disabled={isLoading || disabled}
            icon={submitIcon}
            variant={submitVariant}
          />
        </View>
      </View>
    </View>
  );
}
