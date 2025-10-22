import { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";

type AuthPageWrapperProps = {
  children: ReactNode;
};

export default function AuthPageWrapper({ children }: AuthPageWrapperProps) {
  const year = new Date().getFullYear();

  return (
    <ScrollView contentContainerClassName="flex-1 flex-col justify-around items-center bg-background">
      <View>
        <Text className="text-2xl text-primary font-bold">[ DeskBuddy ]</Text>
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
