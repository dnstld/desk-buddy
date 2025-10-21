import { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";

type AuthPageWrapperProps = {
  children: ReactNode;
};

export default function AuthPageWrapper({ children }: AuthPageWrapperProps) {
  const year = new Date().getFullYear();

  return (
    <ScrollView contentContainerClassName="flex-1 flex-col justify-around items-center bg-primary-950">
      <View>
        <Text className="text-2xl text-white font-bold">[ DeskBuddy ]</Text>
      </View>

      {children}

      <View>
        <Text className="text-sm text-white">
          © {year} dnstld · Privacy · Terms
        </Text>
      </View>
    </ScrollView>
  );
}
