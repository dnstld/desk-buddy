import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const menuItems: MenuItem[] = [
  {
    id: "rooms",
    title: "Rooms",
    icon: "business-outline",
    route: "/(app)/rooms",
  },
  {
    id: "users",
    title: "Users",
    icon: "people-outline",
    route: "/(app)/users",
  },
];

export default function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const slideAnim = useRef(new Animated.Value(-280)).current;
  const [modalVisible, setModalVisible] = React.useState(false);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      // Slide in from left
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide out to left
      Animated.timing(slideAnim, {
        toValue: -280,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false);
      });
    }
  }, [visible, slideAnim]);

  const handleNavigate = (route: string) => {
    onClose();
    router.push(route as any);
  };

  const isActive = (route: string) => {
    return pathname.startsWith(route);
  };

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
      animationType="none"
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.drawerContent,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={styles.drawerInner}
          >
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menu</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    isActive(item.route) && styles.menuItemActive,
                  ]}
                  onPress={() => handleNavigate(item.route)}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={isActive(item.route) ? "#3b82f6" : "#6b7280"}
                  />
                  <Text
                    style={[
                      styles.menuItemText,
                      isActive(item.route) && styles.menuItemTextActive,
                    ]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  drawerContent: {
    backgroundColor: "white",
    width: 280,
    height: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerInner: {
    flex: 1,
    paddingTop: 60,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  menuItems: {
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemActive: {
    backgroundColor: "#eff6ff",
    borderRightWidth: 3,
    borderRightColor: "#3b82f6",
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  menuItemTextActive: {
    color: "#3b82f6",
    fontWeight: "600",
  },
});
