import { ReactNode } from "react";
import { ScrollView, Text } from "react-native";

type CallbackPageWrapperProps = {
  children: ReactNode;
};

export default function CallbackPageWrapper({
  children,
}: CallbackPageWrapperProps) {
  const year = new Date().getFullYear();

  return (
    <ScrollView contentContainerClassName="flex-1 flex-col justify-around items-center bg-background">
      <Text className="text-2xl text-white font-black">WorkSpacey</Text>

      {children}

      <Text className="text-base text-white">© {year} dnstld</Text>
    </ScrollView>
  );
}
