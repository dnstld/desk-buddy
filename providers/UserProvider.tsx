import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/src/lib/supabase";
import { User, UserRole } from "@/src/types/user";

interface UserContextType {
  userData: User | null;
  role: UserRole | null;
  isOwner: boolean;
  isManager: boolean;
  isMember: boolean;
  loading: boolean;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { user, session } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = React.useCallback(async () => {
    if (!user || !session) {
      setUserData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("user")
        .select("*")
        .or(`id.eq.${user.id},auth_id.eq.${user.id}`)
        .single();

      if (fetchError) {
        console.error("Error fetching user data:", fetchError);
        setError(fetchError.message);
        setUserData(null);
        return;
      }

      if (!data) {
        setError("User data not found");
        setUserData(null);
        return;
      }

      // Guard: Ensure role is present
      if (!data.role) {
        console.error("User role is missing");
        setError("User role is not set");
        setUserData(null);
        return;
      }

      setUserData(data);
    } catch (err) {
      console.error("Unexpected error fetching user data:", err);
      setError("Failed to load user data");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, [user, session]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Guard: Show loading state while fetching user data
  if (loading && session) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-4 text-gray-600">Loading user data...</Text>
      </View>
    );
  }

  // Guard: Show error state if user is logged in but role is missing
  if (session && !loading && (error || !userData || !userData.role)) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-xl font-semibold text-red-600 mb-2">
          Unable to Load User Data
        </Text>
        <Text className="text-center text-gray-600 mb-4">
          {error || "User role information is missing. Please contact support."}
        </Text>
        <Text className="text-sm text-gray-500 mb-6">
          This is a security requirement to ensure proper access control.
        </Text>
        <TouchableOpacity
          onPress={fetchUserData}
          className="bg-blue-600 px-6 py-3 rounded-lg active:bg-blue-700"
        >
          <Text className="text-white font-semibold text-center">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const role = userData?.role ?? null;
  const isOwner = role === "owner";
  const isManager = role === "manager";
  const isMember = role === "member";

  const value: UserContextType = {
    userData,
    role,
    isOwner,
    isManager,
    isMember,
    loading,
    refetchUser: fetchUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
