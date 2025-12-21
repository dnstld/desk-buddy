import Icon from "@/src/components/ui/icon";
import Text from "@/src/components/ui/text";
import React from "react";
import { View } from "react-native";

interface EmptyRoleCardProps {
  role: string;
}

export default function EmptyRoleCard({ role }: EmptyRoleCardProps) {
  return (
    <View className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6">
      <View className="items-center">
        <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-3">
          <Icon name="account-group-outline" color="#9ca3af" />
        </View>
        <Text className="text-sm text-gray-500 text-center">No {role} yet</Text>
      </View>
    </View>
  );
}
