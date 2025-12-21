import { colors } from "@/src/theme/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PickerOption {
  value: number;
  label: string;
}

interface PickerFieldProps {
  label: string;
  value: number;
  options: PickerOption[];
  onChange: (value: number) => void;
  error?: string;
  placeholder?: string;
}

export default function PickerField({
  label,
  value,
  options,
  onChange,
  error,
}: PickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleConfirm = () => {
    onChange(tempValue);
    setShowPicker(false);
  };

  const handleSelectOption = (optionValue: number) => {
    setTempValue(optionValue);
    onChange(optionValue);
    setShowPicker(false);
  };

  return (
    <View className="flex-1 gap-2">
      <Text className="text-base font-semibold text-gray-900">{label}</Text>
      <TouchableOpacity
        onPress={() => {
          setTempValue(value);
          setShowPicker(true);
        }}
        className={`
          border rounded-lg p-3 min-h-[50px] justify-center bg-white
          ${error ? "border-error" : "border-gray-200"}
        `.trim()}
      >
        <Text className="text-base text-gray-900">{selectedOption?.label}</Text>
      </TouchableOpacity>

      <Modal visible={showPicker} transparent={true} animationType="slide">
        <Pressable
          className="flex-1 justify-end bg-black/50"
          onPress={() => setShowPicker(false)}
        >
          <View className="bg-white max-h-[500px]">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text className="text-primary text-base">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-base font-semibold">{label}</Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text className="text-primary text-base font-semibold">
                  Done
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView className="max-h-[400px]">
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelectOption(option.value)}
                  className={`
                    p-4 border-b border-gray-100
                    ${value === option.value ? "bg-orange-50" : "bg-white"}
                  `.trim()}
                >
                  <View className="flex-row items-center justify-between">
                    <Text
                      className={`
                        text-base
                        ${
                          value === option.value
                            ? "text-primary font-semibold"
                            : "text-gray-900"
                        }
                      `.trim()}
                    >
                      {option.label}
                    </Text>
                    {value === option.value && (
                      <MaterialCommunityIcons
                        name="check"
                        size={20}
                        color={colors.primary.DEFAULT}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {error && <Text className="text-error text-sm">{error}</Text>}
    </View>
  );
}
