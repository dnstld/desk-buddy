import { useAuth } from "@/providers/AuthProvider";
import AppLoading from "@/src/components/app-loading";
import Workspacey from "@/src/components/logo/workspacey";
import Text from "@/src/components/ui/text";
import { useRoomsQuery } from "@/src/hooks";
import { colors } from "@/src/theme/colors";
import { parseEmailDomain } from "@/src/utils/parse-email-domain";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, Tabs } from "expo-router";
import React, { useMemo } from "react";

const CompanyName = React.memo(() => {
  const { user } = useAuth();

  const companyName = useMemo(() => {
    if (!user?.email) return "Company";

    try {
      const { companyName } = parseEmailDomain(user.email);
      if (!companyName) return "Company";
      return companyName.toUpperCase();
    } catch {
      return "Company";
    }
  }, [user?.email]);

  return <Text variant="xl">{companyName}</Text>;
});

CompanyName.displayName = "CompanyName";

export default function AppLayout() {
  const { session, isLoading } = useAuth();

  // Prefetch rooms data - starts loading immediately when layout mounts
  // React Query will cache the result, so the rooms screen gets instant data
  useRoomsQuery();

  if (isLoading) {
    return <AppLoading />;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.foreground.DEFAULT,
        tabBarInactiveTintColor: colors.foreground.DEFAULT,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={[colors.background.DEFAULT, colors.background[100]]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerBackground: () => (
          <LinearGradient
            colors={[colors.background[100], colors.background.DEFAULT]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        ),
        headerLeft: () => {
          return (
            <Workspacey width={120} accessibilityLabel="Workspacey text logo" />
          );
        },
        headerLeftContainerStyle: {
          paddingLeft: 16,
        },
        headerRight: () => {
          return <CompanyName />;
        },
        headerRightContainerStyle: {
          paddingRight: 16,
        },
        title: "",
      }}
    >
      <Tabs.Screen
        name="rooms"
        options={{
          tabBarLabel: "Rooms",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name="view-grid-outline"
              size={size}
              color={focused ? colors.primary.DEFAULT : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name="chart-bar"
              size={size}
              color={focused ? colors.primary.DEFAULT : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          tabBarLabel: "Users",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name="account-multiple"
              size={size}
              color={focused ? colors.primary.DEFAULT : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name="cog"
              size={size}
              color={focused ? colors.primary.DEFAULT : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
