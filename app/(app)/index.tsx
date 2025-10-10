import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HeaderWithMenu from "../../components/HeaderWithMenu";
import { useAuth } from "../../providers/AuthProvider";

export default function AppHomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <HeaderWithMenu title="Desk Buddy" />
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Desk Buddy!</Text>
        <Text style={styles.subtitle}>Hello, {user?.email}</Text>

        <TouchableOpacity
          style={styles.roomsButton}
          onPress={() => router.push("/rooms")}
        >
          <Text style={styles.buttonText}>View Rooms</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: "#666",
  },
  roomsButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
