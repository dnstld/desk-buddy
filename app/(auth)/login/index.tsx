import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import AuthPageWrapper from "@/src/components/auth-page-wrapper";
import Button from "@/src/components/ui/button";
import { colors } from "@/src/theme/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

type LoginFormData = {
  email: string;
};

export default function LoginScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { signInWithOtp, authError, clearAuthError } = useAuth();
  const { showError, showSuccess } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<LoginFormData>({
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");

  useEffect(() => {
    if (authError) {
      showError(authError);

      const timer = setTimeout(() => {
        clearAuthError();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [authError, showError, clearAuthError]);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
      await signInWithOtp(data.email);
      setEmailSent(true);
      showSuccess("Magic link sent! Check your email.");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send magic link. Please try again.";
      showError(errorMessage);

      if (__DEV__) {
        console.error("[Login] Sign in error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    reset();
  };

  if (emailSent) {
    return (
      <AuthPageWrapper>
        <View className="w-full max-w-sm gap-8 mx-auto">
          <View className="items-center gap-2">
            <MaterialCommunityIcons
              name="email-check"
              size={42}
              color={colors.success.DEFAULT}
            />

            <Text className="text-2xl font-bold text-white">
              Check your inbox
            </Text>
          </View>

          <View className="items-center">
            <Text className="text-white text-center">
              We’ve sent a magic link to
            </Text>
            <Text className="text-lg text-center font-semibold text-white">
              {email}
            </Text>
          </View>

          <Text className="text-sm text-white text-center">
            Didn’t get the email? Check your spam folder or try again
          </Text>

          <Button
            title="Try again"
            onPress={handleTryAgain}
            variant="ghost"
            size="md"
          />
        </View>
      </AuthPageWrapper>
    );
  }

  return (
    <AuthPageWrapper>
      <View className="flex-col items-center gap-12 px-4">
        <View className="items-center gap-3">
          <MaterialCommunityIcons
            name="dots-grid"
            size={56}
            color={colors.primary.DEFAULT}
          />
          <Text className="text-3xl text-white font-black">WorkSpacey</Text>
          <Text className="text-base text-white/90 text-center">
            The easiest way to book your workspace
          </Text>
        </View>

        <View className="w-full max-w-sm gap-6">
          <View className="gap-3">
            <Text className="text-lg font-semibold text-white">
              What's your company email?
            </Text>

            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email address is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
                // TODO: Add company domain restriction error "That doesn’t look like a company email"
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="rounded-lg p-4 bg-white"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="you@company.com"
                  placeholderTextColor={colors.gray.DEFAULT}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  editable={!isSubmitting}
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              )}
            />

            {errors.email && (
              <Text className="text-error text-sm ml-1">
                {errors.email.message}
              </Text>
            )}
          </View>

          <Button
            title="Sign in by email"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            disabled={isSubmitting || !isValid}
            loading={isSubmitting}
            icon="email-fast"
          />

          <View className="flex-row gap-2">
            <MaterialCommunityIcons
              name="security"
              size={16}
              color={colors.success.DEFAULT}
            />
            <Text className="text-sm text-white">
              We’ll send you a magic link to log in
            </Text>
          </View>
        </View>
      </View>
    </AuthPageWrapper>
  );
}
