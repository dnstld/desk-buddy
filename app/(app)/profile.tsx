import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HeaderWithMenu from "../../components/HeaderWithMenu";
import { useAuth } from "../../providers/AuthProvider";

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <HeaderWithMenu title="Profile" />
      <View style={styles.content}>
        <Text style={styles.title}>User Profile</Text>
        <Text style={styles.email}>Email: {user?.email}</Text>
        <Text style={styles.userId}>User ID: {user?.id}</Text>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  email: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  userId: {
    fontSize: 14,
    marginBottom: 30,
    color: "#999",
    fontFamily: "monospace",
  },
  editButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
