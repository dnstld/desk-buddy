import { useAuth } from "@/providers/AuthProvider";
import UserCard from "@/src/components/features/users/user-card";
import AppPageWrapper from "@/src/components/layout/app-page-wrapper";
import { useUserQuery } from "@/src/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, Text, View } from "react-native";

export default function Settings() {
  const { user, signOut } = useAuth();
  const { data: userData } = useUserQuery();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch {
      Alert.alert("Error", "Failed to sign out");
    }
  };

  return (
    <AppPageWrapper>
      {user && userData && (
        <View className="mt-6 px-4">
          <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Account
          </Text>
          <UserCard user={userData} email={user.email || undefined} />
        </View>
      )}

      <View className="mt-6 px-4">
        <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Actions
        </Text>
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <Pressable
            onPress={handleSignOut}
            className="flex-row justify-between items-center py-1 active:opacity-70"
          >
            <View className="flex-row items-center">
              <Ionicons name="log-out-outline" size={20} color="#dc2626" />
              <Text className="ml-3 text-base text-red-600 font-medium">
                Sign Out
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#dc2626" />
          </Pressable>
        </View>
      </View>
    </AppPageWrapper>
  );
}
