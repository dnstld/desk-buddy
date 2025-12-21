import { useAuth } from "@/providers/AuthProvider";
import Button from "@/src/components/ui/button";
import Icon from "@/src/components/ui/icon";
import Text from "@/src/components/ui/text";
import { useUser } from "@/src/hooks";
import { parseEmailDomain } from "@/src/shared/utils/parse-email-domain";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import Logo from "../auth/logo";

export default function Onboarding() {
  const router = useRouter();
  const { user } = useAuth();
  const { isOwner, isMember, isManager } = useUser();

  const getCompanyName = () => {
    if (!user?.email) return "COMPANY";

    try {
      const { companyName } = parseEmailDomain(user.email);
      if (!companyName) return "COMPANY";
      return companyName.toUpperCase();
    } catch {
      return "COMPANY";
    }
  };

  const handleConfirmOwnership = () => {
    router.push("/(modals)/company/confirm-ownership");
  };

  const handleCreateRoom = () => {
    router.push("/(modals)/room/create");
  };

  return (
    <View className="flex-1">
      <View className="flex-1 justify-center p-8">
        <View className="gap-6">
          <View>
            <Text variant="5xl" className="font-bold">
              {isOwner ? "This is the" : "Welcome to the"}
            </Text>
            <Text variant="5xl" className="font-bold text-primary">
              {getCompanyName()}
            </Text>
            <Text variant="5xl" className="font-bold">
              Workspacey!
            </Text>
          </View>

          <View className="gap-4">
            <View className="flex-row gap-2">
              <Icon name={isOwner ? "crown" : "view-grid-plus-outline"} />
              <View className="flex-1 gap-2">
                <Text variant="xl" className="font-bold">
                  {isOwner
                    ? "You have owner-level access, which means you can:"
                    : "No rooms have been created yet"}
                </Text>

                {isMember && (
                  <>
                    <Text>
                      If you’re responsible for the company, you can take
                      ownership and get everything started.
                    </Text>
                    <Text>
                      Once your rooms are ready, publish them so everyone can
                      start booking.
                    </Text>
                  </>
                )}

                {isOwner && (
                  <>
                    <Text>Create and manage rooms</Text>
                    <Text>Assign managers to help you run the workspace</Text>
                    <Text>Manage all members and permissions</Text>
                    <Text>Handle billing if your team chooses a paid plan</Text>
                  </>
                )}

                {isManager && (
                  <>
                    <Text>Create and manage rooms</Text>
                  </>
                )}
              </View>
            </View>
          </View>

          {isOwner && (
            <Button
              title="Create room"
              onPress={handleCreateRoom}
              size="lg"
              icon="plus"
              className="self-start"
            />
          )}

          {isMember && (
            <Button
              title="Start creating rooms"
              onPress={handleConfirmOwnership}
              size="md"
              icon="plus"
              className="self-start"
            />
          )}
        </View>
      </View>

      <View className="flex-row items-center gap-4">
        <Logo size="small" showText={false} />

        {isOwner && (
          <View className="flex-1 gap-2">
            <Text variant="xl" className="font-bold">
              Start now
            </Text>
            <Text>
              Create a room, publish it, and it’ll be ready for reservations
            </Text>
          </View>
        )}
        {isMember && (
          <View className="flex-1 gap-2">
            <Text variant="xl" className="font-bold">
              Not responsible for the company?
            </Text>
            <Text>If that's not you, just invite the right person.</Text>
          </View>
        )}
      </View>
    </View>
  );
}
