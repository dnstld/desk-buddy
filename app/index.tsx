import { Redirect, router } from "expo-router";

import { useAuth } from "@/providers/AuthProvider";
import AppLoading from "@/src/components/app-loading";
import { useHandleUserSignIn, useUserQuery } from "@/src/hooks";
import { useEffect, useState } from "react";

export default function Index() {
  const { session, isLoading, signOut } = useAuth();
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser,
  } = useUserQuery();
  const { mutateAsync: signInUser, isPending } = useHandleUserSignIn();
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [creationAttempted, setCreationAttempted] = useState(false);

  // If we have a session but no user in database, create the user
  useEffect(() => {
    const createUserIfNeeded = async () => {
      if (isLoading || isUserLoading || isCreatingUser) {
        return;
      }
      if (!session) {
        return;
      }
      if (userData) {
        return;
      }
      if (isPending) {
        return;
      }

      // Prevent multiple attempts
      if (creationAttempted) {
        return;
      }

      if (!userError) {
        return;
      }

      setCreationAttempted(true);
      setIsCreatingUser(true);

      try {
        const result = await signInUser();

        if (!result.success) {
          // User creation failed, sign out and show error
          await signOut();

          router.replace({
            pathname: "/(auth)/login",
            params: {
              error:
                result.error ||
                "Failed to create user account. Please try logging in again.",
            },
          });
          return;
        }

        // Success - refetch user data to update the UI
        const refetchResult = await refetchUser();

        if (__DEV__) {
          console.log("[Index] Refetch result:", {
            hasData: !!refetchResult.data,
            isError: !!refetchResult.error,
            error: refetchResult.error?.message,
          });
        }
      } catch {
        // Sign out and redirect to login with error
        await signOut();

        router.replace({
          pathname: "/(auth)/login",
          params: {
            error: "An unexpected error occurred. Please try logging in again.",
          },
        });
      } finally {
        setIsCreatingUser(false);
      }
    };

    createUserIfNeeded();
  }, [
    session,
    isLoading,
    isUserLoading,
    userData,
    userError,
    signInUser,
    signOut,
    isCreatingUser,
    isPending,
    refetchUser,
    creationAttempted,
  ]);

  if (isLoading || isUserLoading || isCreatingUser) {
    return <AppLoading />;
  }

  if (session && userData) {
    return <Redirect href="/(tabs)/rooms" />;
  }

  if (session && !userData) {
    // Waiting for user creation or failed
    return <AppLoading />;
  }

  return <Redirect href="/(auth)/login" />;
}
