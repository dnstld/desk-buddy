import { colors } from "@/src/theme/colors";
import React from "react";
import { View } from "react-native";

interface DividerProps {
  width?: number;
  orientation?: "horizontal" | "vertical";
  dividerStyle?: any;
}

const Divider: React.FC<DividerProps> = ({
  width = 1,
  orientation = "horizontal",
  dividerStyle,
}) => {
  const dividerStyles = [
    { width: orientation === "horizontal" ? "100%" : width },
    { height: orientation === "vertical" ? "100%" : width },
    { backgroundColor: colors.gray[50] },
    dividerStyle,
  ];

  return <View style={dividerStyles} />;
};

export default Divider;
