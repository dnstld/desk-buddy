import { ReactNode } from "react";
import { ScrollView, View } from "react-native";

type AppPageWrapperProps = {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
};

export default function AppPageWrapper({
  children,
  className = "",
  scrollable = true,
  ...rest
}: AppPageWrapperProps) {
  if (!scrollable) {
    return (
      <View className={`flex-1 bg-background ${className}`} {...rest}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerClassName={`flex-1 bg-background ${className}`}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}
