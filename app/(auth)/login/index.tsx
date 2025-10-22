import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import AuthPageWrapper from "@/src/components/auth-page-wrapper";
import Button from "@/src/components/ui/button";
import { colors } from "@/src/theme/colors";
import { getErrorMessage } from "@/src/utils/error-handler";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

type LoginFormData = {
  email: string;
};

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signInWithOtp, clearAuthError } = useAuth();
  const { showError } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    clearAuthError();

    try {
      await signInWithOtp(data.email);
      setEmailSent(true);
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Failed to send magic link");
      showError(errorMessage);
    } finally {
      setLoading(false);
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
      <View className="flex-col items-center gap-12">
        <View className="items-center gap-2">
          <MaterialCommunityIcons
            name="dots-grid"
            size={48}
            color={colors.primary.DEFAULT}
          />
          <Text className="text-2xl text-white font-black">WorkSpacey</Text>
          <Text className="text-base text-white">
            The easiest way to book your workspace
          </Text>
        </View>

        <View className="w-full max-w-sm gap-8">
          <View className="gap-2">
            <Text className="text-base font-semibold text-white">
              What’s your work email?
            </Text>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Please enter your email address",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="rounded-lg p-4 bg-white"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="you@company.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              )}
            />
            {errors.email && (
              <Text className="text-error text-sm">{errors.email.message}</Text>
            )}
          </View>

          <Button
            title="Send link"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            disabled={loading}
            loading={loading}
            icon="email-fast"
          />

          <Text className="text-base text-center text-white">
            We’ll email you a magic link to sign in
          </Text>
        </View>
      </View>
    </AuthPageWrapper>
  );
}
