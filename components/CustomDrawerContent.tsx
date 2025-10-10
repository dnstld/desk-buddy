import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../providers/AuthProvider";

interface CustomDrawerContentProps {
  navigation: any;
}

export default function CustomDrawerContent({
  navigation,
}: CustomDrawerContentProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            navigation.closeDrawer();
            router.replace("/(auth)/login");
          } catch (error) {
            console.error("Error signing out:", error);
            Alert.alert("Error", "Failed to sign out");
          }
        },
      },
    ]);
  };

  const handleSettings = () => {
    navigation.closeDrawer();
    router.push("/settings" as any);
  };

  const handleProfile = () => {
    navigation.closeDrawer();
    router.push("/profile" as any);
  };

  return (
    <DrawerContentScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
        {user && <Text style={styles.userEmail}>{user.email}</Text>}
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.menuItem} onPress={handleProfile}>
          <Text style={styles.menuItemText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={[styles.menuItem, styles.signOutItem]}
          onPress={handleSignOut}
        >
          <Text style={[styles.menuItemText, styles.signOutText]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#3b82f6",
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 14,
    color: "#e2e8f0",
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  menuItemText: {
    fontSize: 16,
    color: "#374151",
  },
  separator: {
    height: 1,
    backgroundColor: "#d1d5db",
    marginVertical: 10,
  },
  signOutItem: {
    marginTop: 20,
  },
  signOutText: {
    color: "#dc2626",
    fontWeight: "600",
  },
});
