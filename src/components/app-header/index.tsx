import React from "react";
import { Text, View } from "react-native";
import { useAuth } from "../../../providers/AuthProvider";
import { parseEmailDomain } from "../../utils/parse-email-domain";

export default function AppHeader() {
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

  return (
    <View className="flex-row items-center justify-between p-4 bg-primary-500 pt-[60px]">
      <Text className="text-xl font-bold text-white">Desk Buddy</Text>
      <Text className="text-xl text-white">{getCompanyName()}</Text>
    </View>
  );
}
