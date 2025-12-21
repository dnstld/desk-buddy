import Icon from "@/src/components/ui/icon";
import Text from "@/src/components/ui/text";
import { User } from "@/src/types/user";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

interface UserCardProps {
  user: User;
  email?: string;
  onPress?: () => void;
}

export default function UserCard({ user, email, onPress }: UserCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/(modals)/user/${user.id}`);
    }
  };

  const isInteractive = onPress !== undefined;
  const content = (
    <View className="flex-row items-center">
      <View className="w-14 h-14 rounded-full bg-primary items-center justify-center">
        <Text className="text-white text-2xl font-bold">
          {(
            user.name?.charAt(0) ||
            user.email?.charAt(0) ||
            email?.charAt(0) ||
            "U"
          ).toUpperCase()}
        </Text>
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-base font-semibold text-gray-900 mb-1">
          {user.email || email}
        </Text>
        {user.name && (
          <Text className="text-sm text-gray-700 mb-0.5">{user.name}</Text>
        )}
        <Text className="text-sm text-gray-500">{user.role}</Text>
      </View>
      {isInteractive && <Icon name="chevron-right" />}
    </View>
  );

  if (!isInteractive) {
    return <View className="bg-white rounded-xl p-4 shadow-sm">{content}</View>;
  }

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-xl p-4 shadow-sm active:opacity-70"
    >
      {content}
    </Pressable>
  );
}
