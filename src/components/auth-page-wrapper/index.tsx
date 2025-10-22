import { colors } from "@/src/theme/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";

type AuthPageWrapperProps = {
  children: ReactNode;
};

export default function AuthPageWrapper({ children }: AuthPageWrapperProps) {
  const year = new Date().getFullYear();

  return (
    <ScrollView
      contentContainerClassName="flex-1 flex-col justify-around items-center bg-background"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons
          name="login"
          size={16}
          color={colors.gray[50]}
        />
        <Text className="text-white font-base">Sign in</Text>
      </View>

      <View className="w-full">{children}</View>

      <View>
        <Text className="text-sm text-white">
          © {year} dnstld · Privacy · Terms
        </Text>
      </View>
    </ScrollView>
  );
}
