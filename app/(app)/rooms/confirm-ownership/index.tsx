import { useToast } from "@/providers/ToastProvider";
import Logo from "@/src/components/logo";
import ModalActions from "@/src/components/modal-actions";
import Icon from "@/src/components/ui/icon";
import Text from "@/src/components/ui/text";
import { useUser } from "@/src/hooks";
import { supabase } from "@/src/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";

const RESPONSIBILITIES = [
  "Create and manage rooms",
  "Assign managers to help you run the workspace",
  "Manage all members and permissions",
  "Handle billing if your team chooses a paid plan",
];

export default function ConfirmOwnership() {
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useUser();
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();

  const handleCancel = () => {
    router.back();
  };

  const handleConfirm = async () => {
    if (!userData?.id || !userData?.company_id) {
      showError("User data not available. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      // Get current session for auth token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("No active session. Please sign in again.");
      }

      // Call the Edge Function to claim ownership atomically
      const { data, error } = await supabase.functions.invoke(
        "claim-company-ownership",
        {
          body: {
            userId: userData.id,
            companyId: userData.company_id,
          },
        }
      );

      if (error) {
        throw new Error(error.message || "Failed to claim ownership");
      }

      if (!data?.success) {
        // Handle specific error cases
        if (data?.error === "Company already has an owner") {
          throw new Error(
            "This company already has an owner. Please contact your company administrator."
          );
        }
        throw new Error(data?.error || "Failed to claim ownership");
      }

      // Invalidate user query to refresh the user data
      await queryClient.invalidateQueries({ queryKey: ["user"] });

      showSuccess("You are now the company owner!");
      router.replace("/(app)/rooms");
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Failed to confirm ownership"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background-50">
      <ScrollView className="flex-1" contentContainerClassName="p-16">
        <View className="gap-4 items-start">
          <Logo size="small" showText={false} />

          <Text variant="xl" className="font-bold">
            Confirm company ownership
          </Text>

          <Text>
            By taking ownership, you become legally responsible for managing
            this company's workspace.
          </Text>

          <View className="gap-4 w-full">
            <Text className="font-bold">This includes:</Text>

            <View className="gap-2">
              {RESPONSIBILITIES.map((item, index) => (
                <View key={index} className="flex-row gap-2">
                  <Icon name="check-circle" variant="sm" className="mt-1" />
                  <Text className="flex-1">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text className="font-bold">
            Please confirm that you are authorized to act on behalf of your
            organization
          </Text>
        </View>
      </ScrollView>

      <ModalActions
        onCancel={handleCancel}
        onSubmit={handleConfirm}
        submitText="Confirm"
        submitVariant="primary"
        submitIcon="check-all"
        isLoading={isLoading}
        disabled={isLoading}
      />
    </View>
  );
}
