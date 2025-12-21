import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useRef, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  onPress: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  children: React.ReactNode;
  disabled?: boolean;
}

export default function Dropdown({
  items,
  children,
  disabled = false,
}: DropdownProps) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<View>(null);

  console.log("[Dropdown] Items received:", items);
  console.log("[Dropdown] Items count:", items.length);

  const openDropdown = () => {
    if (!disabled) {
      console.log("[Dropdown] Opening dropdown with items:", items);
      setIsVisible(true);
    }
  };

  const closeDropdown = () => {
    setIsVisible(false);
  };

  const handleItemPress = (item: DropdownItem) => {
    closeDropdown();
    if (!item.disabled) {
      setTimeout(() => item.onPress(), 100); // Small delay to allow modal to close
    }
  };

  const getItemTextColor = (item: DropdownItem) => {
    if (item.disabled) return "text-gray-400";
    if (item.variant === "danger") return "text-red-500";
    return "text-gray-700";
  };

  const getItemIconColor = (item: DropdownItem) => {
    if (item.disabled) return "#9CA3AF";
    if (item.variant === "danger") return "#EF4444";
    return "#374151";
  };

  // Calculate dropdown position
  const dropdownWidth = 160;

  console.log("[Dropdown] Modal visible:", isVisible);

  return (
    <>
      <Pressable
        ref={triggerRef}
        onPress={() => {
          console.log("[Dropdown] Pressable clicked! Disabled:", disabled);
          openDropdown();
        }}
        disabled={disabled}
      >
        {children}
      </Pressable>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={closeDropdown}
          className="bg-black/20 justify-center items-center"
        >
          <Pressable
            style={{
              minWidth: dropdownWidth,
              maxWidth: 200,
            }}
            className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 mx-4"
          >
            {items.map((item, index) => {
              console.log("[Dropdown] Rendering item:", item.id, item.label);
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleItemPress(item)}
                  disabled={item.disabled}
                  className={`
                  flex-row items-center px-4 py-3 
                  ${item.disabled ? "opacity-50" : "active:bg-gray-50"}
                  ${index < items.length - 1 ? "border-b border-gray-100" : ""}
                `.trim()}
                >
                  {item.icon && (
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={20}
                      color={getItemIconColor(item)}
                      style={{ marginRight: 12 }}
                    />
                  )}
                  <Text
                    className={`
                    text-base font-medium flex-1
                    ${getItemTextColor(item)}
                  `.trim()}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
