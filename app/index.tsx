import { Redirect } from "expo-router";

import { useAuth } from "@/providers/AuthProvider";

export default function Index() {
  const { session } = useAuth();

  if (session) {
    return <Redirect href="/(app)/rooms" />;
  }

  return <Redirect href="/(auth)/login" />;
}
