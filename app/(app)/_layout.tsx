import { themeColors } from "@/src/constants/colors";
import { parseEmailDomain } from "@/src/utils/parse-email-domain";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageStyle, Text } from "react-native";
import { useAuth } from "../../providers/AuthProvider";

function LogoTitle(_props: any) {
  return (
    <Image
      style={{ width: 24, height: 24 } as ImageStyle}
      source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
    />
  );
}

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
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.gray,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: themeColors.primary,
          borderBottomWidth: 0,
          shadowColor: "transparent",
          paddingHorizontal: 4,
        },
        headerLeft: (props) => {
          return <LogoTitle {...props} />;
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
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
