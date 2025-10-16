import { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";

type AuthPageWrapperProps = {
  children: ReactNode;
};

export default function AuthPageWrapper({ children }: AuthPageWrapperProps) {
  return (
    <ScrollView contentContainerClassName="flex-1 flex-col justify-around items-center bg-primary-950">
      <View>
        <Text className="text-base text-white">Logo</Text>
      </View>

      {children}

      <View>
        <Text className="text-sm text-white">dnstld</Text>
      </View>
    </ScrollView>
  );
}
