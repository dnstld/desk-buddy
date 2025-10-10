import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../providers/AuthProvider";

export default function AppHeader() {
  const { user } = useAuth();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Desk Buddy</Text>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#3b82f6",
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
