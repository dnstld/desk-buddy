import Icon, { IconName } from "@/src/components/ui/icon";
import Text from "@/src/components/ui/text";
import { View } from "react-native";

interface IconTextProps {
  icon: IconName;
  text: string;
  variant?: "sm" | "base";
}

export default function IconText({
  icon,
  text,
  variant = "base",
}: IconTextProps) {
  return (
    <View className="flex-row items-center gap-2">
      <Icon name={icon} variant={variant} aria-hidden={true} />
      <Text variant={variant}>{text}</Text>
    </View>
  );
}
