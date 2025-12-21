import EmptyRoleCard from "@/src/components/features/users/empty-role-card";
import OwnerInvitationCard from "@/src/components/features/users/owner-invitation-card";
import UserListCard from "@/src/components/features/users/user-list-card";
import AppPageWrapper from "@/src/components/layout/app-page-wrapper";
import Text from "@/src/components/ui/text";
import { useUserQuery, useUsersQuery } from "@/src/hooks";
import { User } from "@/src/types/user";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, SectionList, View } from "react-native";

type Section = {
  title: string;
  data: User[];
  role: "owner" | "manager" | "member";
};

export default function Users() {
  const { data: userData, refetch: refetchUser } = useUserQuery();
  const {
    data: users,
    isLoading,
    error,
    refetch: refetchUsers,
  } = useUsersQuery(userData?.company_id || undefined);

  // Refetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetchUser();
      refetchUsers();
    }, [refetchUser, refetchUsers])
  );

  const sections = useMemo((): Section[] => {
    if (!users) return [];

    const grouped = users.reduce(
      (acc, user) => {
        if (user.role === "owner") {
          acc.owners.push(user);
        } else if (user.role === "manager") {
          acc.managers.push(user);
        } else {
          acc.members.push(user);
        }
        return acc;
      },
      { owners: [] as User[], managers: [] as User[], members: [] as User[] }
    );

    return [
      {
        title: "Owner",
        data: grouped.owners,
        role: "owner" as const,
      },
      {
        title: "Managers",
        data: grouped.managers,
        role: "manager" as const,
      },
      {
        title: "Members",
        data: grouped.members,
        role: "member" as const,
      },
    ];
  }, [users]);

  if (isLoading) {
    return (
      <AppPageWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text className="mt-4 text-gray">Loading users...</Text>
        </View>
      </AppPageWrapper>
    );
  }

  if (error) {
    return (
      <AppPageWrapper>
        <View className="flex-1 items-center justify-center py-8">
          <Text className="text-base text-error text-center px-4">
            {error instanceof Error ? error.message : "Failed to load users"}
          </Text>
        </View>
      </AppPageWrapper>
    );
  }

  return (
    <AppPageWrapper scrollable={false}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <UserListCard user={item} />}
        renderSectionHeader={({ section }) => (
          <Text className="text-sm font-semibold uppercase tracking-wide mb-2">
            {section.title}
          </Text>
        )}
        renderSectionFooter={({ section }) =>
          section.data.length === 0 ? (
            <View className="gap-2">
              {section.role === "owner" ? (
                <OwnerInvitationCard />
              ) : (
                <EmptyRoleCard role={section.title.toLowerCase()} />
              )}
            </View>
          ) : (
            <View className="h-3" />
          )
        }
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListFooterComponent={<View className="h-6" />}
      />
    </AppPageWrapper>
  );
}
