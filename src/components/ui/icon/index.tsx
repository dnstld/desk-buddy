import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface IconProps {
  name: IconName;
  variant?: "sm" | "base";
  color?: string;
  className?: string;
}

export default function Icon({
  name,
  variant = "base",
  color,
  className,
}: IconProps) {
  const size = variant === "sm" ? 16 : 24;

  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={color}
      className={className}
    />
  );
}
