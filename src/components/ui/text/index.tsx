import { clsx } from "clsx";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

interface TextProps extends RNTextProps {
  variant?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "5xl";
}

export default function Text({
  className,
  variant = "lg",
  ...props
}: TextProps) {
  const variantClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "5xl": "text-5xl",
  };

  return (
    <RNText
      className={clsx("text-foreground", variantClasses[variant], className)}
      {...props}
    />
  );
}
