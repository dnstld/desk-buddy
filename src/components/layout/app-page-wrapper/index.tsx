import { ReactNode } from "react";
import { ScrollView, View } from "react-native";

type AppPageWrapperProps = {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
  variant?: "default" | "modal";
};

export default function AppPageWrapper({
  children,
  className = "",
  scrollable = true,
  variant = "default",
  ...rest
}: AppPageWrapperProps) {
  const bgColor = variant === "modal" ? "bg-background-100" : "bg-background";

  if (!scrollable) {
    return (
      <View className={`flex-1 p-4 gap-8 ${bgColor} ${className}`} {...rest}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerClassName={`flex-1 p-4 gap-8 ${bgColor} ${className}`}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}
