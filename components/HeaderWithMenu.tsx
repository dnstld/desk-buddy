import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../providers/AuthProvider";

interface HeaderWithMenuProps {
  title: string;
  subtitle?: string;
}

export default function HeaderWithMenu({
  title,
  subtitle,
}: HeaderWithMenuProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(280)).current; // Start off-screen to the right

  console.log("HeaderWithMenu rendering with title:", title);

  useEffect(() => {
    if (modalVisible) {
      // Slide in from right
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide out to right
      Animated.timing(slideAnim, {
        toValue: 280,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible, slideAnim]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSignOut = async () => {
    try {
      closeModal();
      await signOut();
      router.replace("/(auth)/login");
    } catch {
      Alert.alert("Error", "Failed to sign out");
    }
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={() => {
            console.log("Avatar button pressed!");
            openModal();
          }}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
        animationType="none"
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}} // Prevent closing when tapping inside modal
              style={styles.modalInner}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Account</Text>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              {user && (
                <View style={styles.userInfo}>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
              )}

              <View style={styles.menuItems}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleSignOut}
                >
                  <Ionicons name="log-out-outline" size={20} color="#dc2626" />
                  <Text style={[styles.menuItemText, styles.signOutText]}>
                    Sign Out
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#3b82f6", // Back to blue
    paddingTop: 60, // Account for status bar
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  menuButton: {
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent background
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 44,
    minHeight: 44,
  },
  menuButtonText: {
    color: "white", // White text
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  avatarButton: {
    padding: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    width: 280,
    height: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalInner: {
    flex: 1,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  userInfo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#f8fafc",
  },
  userEmail: {
    fontSize: 14,
    color: "#6b7280",
  },
  menuItems: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  signOutText: {
    color: "#dc2626",
  },
});
