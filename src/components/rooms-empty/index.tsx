import { useRole } from "@/providers/RoleProvider";
import { colors } from "@/src/theme/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Text, View } from "react-native";

export default function RoomsEmpty() {
  const { isMember, isManager, isOwner } = useRole();

  return (
    <>
      {isMember && (
        <View>
          <Text className="text-white">Intro screen for members</Text>
        </View>
      )}
      {(isManager || isOwner) && (
        <View className="bg-background-900 rounded-lg shadow-sm p-8">
          {/* Header Section */}
          <View className="items-center gap-2 mb-10">
            <Text className="text-2xl font-bold text-secondary">
              Let&apos;s get started
            </Text>
            <Text className="text-base text-white">
              Create your first room in two quick steps
            </Text>
          </View>

          {/* Steps */}
          <View className="gap-8">
            {/* Step 1 */}
            <View className="flex-row items-start gap-5">
              <View className="items-center pt-1">
                <View className="bg-background-800 w-12 h-12 rounded-xl items-center justify-center">
                  <MaterialCommunityIcons
                    name="pencil-outline"
                    size={24}
                    color={colors.primary.DEFAULT}
                  />
                </View>
              </View>
              <View className="flex-1">
                <View className="flex-row items-baseline gap-2 mb-2">
                  <Text className="text-xs font-bold text-primary">STEP 1</Text>
                </View>
                <Text className="text-lg font-semibold text-white">
                  Create a room
                </Text>
                <Text className="text-sm text-white leading-relaxed">
                  Add a workspace for desk booking or a meeting room for team
                  sessions
                </Text>
              </View>
            </View>

            {/* Step 2 */}
            <View className="flex-row items-start gap-5">
              <View className="items-center pt-1">
                <View className="bg-background-800 w-12 h-12 rounded-xl items-center justify-center">
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={24}
                    color={colors.primary.DEFAULT}
                  />
                </View>
              </View>
              <View className="flex-1">
                <View className="flex-row items-baseline gap-2 mb-2">
                  <Text className="text-xs font-bold text-primary">STEP 2</Text>
                </View>
                <Text className="text-lg font-semibold text-white">
                  Publish it
                </Text>
                <Text className="text-sm text-white leading-relaxed">
                  Make it live so your team can start booking right away
                </Text>
              </View>
            </View>

            {isOwner && (
              <View>
                <Text className="text-white">
                  More steps available for owners
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </>
  );
}
