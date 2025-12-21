import Icon from "@/src/components/ui/icon";
import Text from "@/src/components/ui/text";
import { User } from "@/src/types/user";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

interface UserListCardProps {
  user: User;
  email?: string;
}

export default function UserListCard({ user, email }: UserListCardProps) {
  const router = useRouter();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-700";
      case "manager":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handlePress = () => {
    router.push(`/(modals)/user/${user.id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-xl p-4 shadow-sm active:opacity-70"
    >
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
          <View className="flex-row items-center mt-1">
            <View
              className={`px-2 py-0.5 rounded ${getRoleBadgeColor(user.role)}`}
            >
              <Text
                className={`text-xs font-medium capitalize ${
                  getRoleBadgeColor(user.role).split(" ")[1]
                }`}
              >
                {user.role}
              </Text>
            </View>
          </View>
        </View>
        <View className="ml-2">
          <Icon name="chevron-right" color="#9ca3af" />
        </View>
      </View>
    </Pressable>
  );
}
