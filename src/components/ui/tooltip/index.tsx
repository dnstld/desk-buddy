import React, { ReactNode, useRef, useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";

interface TooltipProps {
  trigger: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}

export default function Tooltip({ trigger, children, disabled }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const buttonRef = useRef<View>(null);

  const handlePress = () => {
    if (disabled) return;

    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setButtonLayout({ x, y, width, height });
      setVisible(true);
    });
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        ref={buttonRef}
        onPress={handlePress}
        disabled={disabled}
      >
        {trigger}
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleClose}
          className="flex-1"
        >
          <View
            style={{
              position: "absolute",
              top: buttonLayout.y + buttonLayout.height + 4,
              right: 16,
            }}
          >
            {children}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
