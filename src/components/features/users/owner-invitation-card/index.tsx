import Icon from "@/src/components/ui/icon";
import Text from "@/src/components/ui/text";
import React from "react";
import { Pressable, View } from "react-native";

export default function OwnerInvitationCard() {
  const handleShare = () => {
    // TODO: Implement sharing functionality
    console.log("Share invitation");
  };

  return (
    <View className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl p-6">
      <View className="items-center">
        <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mb-4">
          <Icon name="account-plus" color="#3b82f6" />
        </View>
        <Text className="text-lg font-semibold text-gray-900 mb-2 text-center">
          No Owner Yet
        </Text>
        <Text className="text-sm text-gray-600 text-center mb-4">
          Claim ownership or invite someone to manage this company
        </Text>
        <Pressable
          onPress={handleShare}
          className="bg-blue-500 px-6 py-3 rounded-lg active:opacity-70"
        >
          <Text className="text-white font-semibold">Share Now</Text>
        </Pressable>
      </View>
    </View>
  );
}
