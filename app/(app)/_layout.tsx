import { useAuth } from "@/providers/AuthProvider";
import { colors } from "@/src/theme/colors";
import { parseEmailDomain } from "@/src/utils/parse-email-domain";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";

function CompanyName() {
  const { user } = useAuth();

  const getCompanyName = () => {
    if (!user?.email) return "Company";

    try {
      const { companyName } = parseEmailDomain(user.email);
      if (!companyName) return "Company";
      return companyName.toUpperCase();
    } catch {
      return "Company";
    }
  };

  return <Text className="text-sm text-white">{getCompanyName()}</Text>;
}

export default function AppLayout() {
  const { session, loading } = useAuth();

  if (!loading && !session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary.DEFAULT,
        tabBarInactiveTintColor: colors.gray[100],
        tabBarStyle: {
          backgroundColor: colors.background.DEFAULT,
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: colors.background.DEFAULT,
          borderBottomWidth: 0,
          shadowColor: "transparent",
        },
        headerLeft: () => {
          return (
            <Text className="text-base text-white font-bold">DeskBuddy</Text>
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
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="dots-grid"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chart-bar"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          tabBarLabel: "Users",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-multiple"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
