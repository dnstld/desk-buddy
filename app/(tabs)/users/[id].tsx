import AppPageWrapper from "@/src/components/layout/app-page-wrapper";
import QueryError from "@/src/components/query-error";
import Button from "@/src/components/ui/button";
import Divider from "@/src/components/ui/divider";
import Icon from "@/src/components/ui/icon";
import Text from "@/src/components/ui/text";
import {
  useDeleteUser,
  useFetchUser,
  useSetManager,
  useUpdateUserRole,
  useUserQuery,
  useUsersQuery,
} from "@/src/hooks";
import {
  ALERT_MESSAGES,
  LOADING_MESSAGES,
  ROLE_DESCRIPTIONS,
  ROLES,
} from "@/src/shared/constants/user-roles";
import {
  formatJoinDate,
  getDeleteUserMessage,
  getRoleChangeMessage,
  getUserDisplayName,
} from "@/src/shared/utils/user-helpers";
import { colors } from "@/src/theme/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Switch, View } from "react-native";

export default function UserDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: user, isLoading, error, refetch } = useFetchUser(id);
  const { data: currentUser } = useUserQuery();

  const canManageRoles = currentUser?.role === ROLES.OWNER;

  const { mutate: updateUserRole, isPending: isUpdatingRole } =
    useUpdateUserRole();
  const { mutate: setManager, isPending: isSettingManager } = useSetManager();
  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUser();

  const { data: users = [] } = useUsersQuery(
    canManageRoles && user?.role !== ROLES.OWNER
      ? currentUser?.company_id || undefined
      : undefined
  );

  const [optimisticRole, setOptimisticRole] = useState<
    "member" | "manager" | null
  >(null);

  const isPending = isUpdatingRole || isSettingManager || isDeletingUser;

  const displayRole = useMemo(
    () => optimisticRole || user?.role,
    [optimisticRole, user?.role]
  );

  const formattedJoinDate = useMemo(
    () => (user?.created_at ? formatJoinDate(user.created_at) : ""),
    [user?.created_at]
  );

  const userDisplayName = useMemo(() => getUserDisplayName(user), [user]);

  const handleRoleChange = useCallback(
    (newRole: "member" | "manager"): void => {
      if (!user || newRole === user.role) return;

      const currentManager = users.find(
        (u) => u.role === ROLES.MANAGER && u.id !== user.id
      );

      const confirmMessage = getRoleChangeMessage(
        userDisplayName,
        newRole,
        currentManager
      );

      Alert.alert(ALERT_MESSAGES.ROLE_CHANGE_TITLE, confirmMessage, [
        {
          text: ALERT_MESSAGES.CANCEL,
          style: "cancel",
        },
        {
          text: ALERT_MESSAGES.CONFIRM,
          onPress: () => {
            setOptimisticRole(newRole);

            if (newRole === ROLES.MANAGER && currentUser?.company_id) {
              setManager(
                {
                  userId: user.id,
                  companyId: currentUser.company_id,
                },
                {
                  onSuccess: () => {
                    refetch();
                    setOptimisticRole(null);
                  },
                  onError: (error) => {
                    setOptimisticRole(null);
                    Alert.alert(
                      ALERT_MESSAGES.ERROR_TITLE,
                      error?.message ||
                        "Failed to update role. Please try again."
                    );
                  },
                }
              );
            } else {
              updateUserRole(
                {
                  userId: user.id,
                  newRole,
                },
                {
                  onSuccess: () => {
                    refetch();
                    setOptimisticRole(null);
                  },
                  onError: (error) => {
                    setOptimisticRole(null);
                    Alert.alert(
                      ALERT_MESSAGES.ERROR_TITLE,
                      error?.message ||
                        "Failed to update role. Please try again."
                    );
                  },
                }
              );
            }
          },
        },
      ]);
    },
    [
      user,
      users,
      userDisplayName,
      updateUserRole,
      setManager,
      currentUser?.company_id,
      refetch,
    ]
  );

  const handleDeleteUser = useCallback((): void => {
    if (!user) return;

    const confirmMessage = getDeleteUserMessage(userDisplayName);

    Alert.alert(ALERT_MESSAGES.DELETE_TITLE, confirmMessage, [
      {
        text: ALERT_MESSAGES.CANCEL,
        style: "cancel",
      },
      {
        text: ALERT_MESSAGES.DELETE_CONFIRM,
        style: "destructive",
        onPress: () => {
          if (currentUser?.company_id) {
            deleteUser(
              {
                userId: user.id,
                companyId: currentUser.company_id,
              },
              {
                onSuccess: () => {
                  router.back();
                },
                onError: (error) => {
                  Alert.alert(
                    ALERT_MESSAGES.ERROR_TITLE,
                    error?.message || "Failed to delete user. Please try again."
                  );
                },
              }
            );
          }
        },
      },
    ]);
  }, [user, userDisplayName, deleteUser, currentUser?.company_id, router]);

  const handleToggleManager = useCallback(
    (value: boolean) => handleRoleChange(value ? ROLES.MANAGER : ROLES.MEMBER),
    [handleRoleChange]
  );

  if (isLoading && !user) {
    return (
      <AppPageWrapper scrollable={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-3 text-base text-gray">
            {LOADING_MESSAGES.LOADING_USER}
          </Text>
        </View>
      </AppPageWrapper>
    );
  }

  if (error) {
    return (
      <AppPageWrapper scrollable={false}>
        <QueryError error={new Error(error)} onRetry={() => refetch()} />
      </AppPageWrapper>
    );
  }

  if (!user) {
    return (
      <AppPageWrapper scrollable={false}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-gray">User not found</Text>
        </View>
      </AppPageWrapper>
    );
  }

  return (
    <AppPageWrapper>
      <View className="bg-white rounded-xl p-4 shadow-sm gap-4">
        <View className="flex-row items-center gap-4">
          <Icon name="email-outline" color={colors.gray[50]} />
          <View className="flex-1">
            <Text variant="sm" className="text-gray mb-1">
              Email
            </Text>
            <Text>{user.email}</Text>
          </View>
        </View>

        <Divider />

        <View className="flex-row items-center gap-4">
          <Icon name="calendar-outline" color={colors.gray[50]} />
          <View className="flex-1">
            <Text variant="sm" className="text-gray mb-1">
              Joined
            </Text>
            <Text>{formattedJoinDate}</Text>
          </View>
        </View>
      </View>

      {canManageRoles && user.role !== ROLES.OWNER && (
        <View className="gap-2">
          <Text
            variant="sm"
            className="font-semibold text-gray uppercase tracking-wide"
          >
            Role Management
          </Text>

          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <Icon
                  name="shield-account-outline"
                  color={
                    displayRole === ROLES.MANAGER
                      ? colors.primary.DEFAULT
                      : colors.gray.DEFAULT
                  }
                />
                <View className="ml-3 flex-1">
                  <Text className="text-base font-semibold mb-0.5">
                    Manager
                  </Text>
                  <Text variant="sm" className="text-gray">
                    {ROLE_DESCRIPTIONS.MANAGER}
                  </Text>
                </View>
              </View>
              {isPending ? (
                <ActivityIndicator size="small" />
              ) : (
                <View>
                  <Switch
                    value={displayRole === ROLES.MANAGER}
                    onValueChange={handleToggleManager}
                    disabled={isPending}
                    trackColor={{
                      false: colors.gray.DEFAULT,
                      true: colors.primary.DEFAULT,
                    }}
                    accessible={true}
                    accessibilityLabel={`Toggle manager role for ${userDisplayName}`}
                    accessibilityHint="Double tap to change user's role"
                    accessibilityState={{
                      checked: displayRole === ROLES.MANAGER,
                    }}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {canManageRoles && user.role !== ROLES.OWNER && (
        <View className="gap-2">
          <Text
            variant="sm"
            className="font-semibold text-gray uppercase tracking-wide"
          >
            Danger Zone
          </Text>
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Button
              title="Remove User"
              description={ALERT_MESSAGES.DELETE_WARNING}
              onPress={handleDeleteUser}
              disabled={isPending}
              variant="danger-outline"
              icon="delete-outline"
            />
          </View>
        </View>
      )}
    </AppPageWrapper>
  );
}
