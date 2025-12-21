import Button from "@/src/components/ui/button";
import Text from "@/src/components/ui/text";
import { colors } from "@/src/theme/colors";
import {
  EMAIL_VALIDATION,
  LoginFormData,
} from "@/src/shared/validations/login-validation";
import { Controller, UseFormReturn } from "react-hook-form";
import { TextInput, View } from "react-native";
import IconText from "@/src/components/ui/icon-text";

export type LoginFormProps = {
  form: UseFormReturn<LoginFormData>;
  isSubmitting: boolean;
  onSubmit: (data: LoginFormData) => void;
};

export default function LoginForm({
  form,
  isSubmitting,
  onSubmit,
}: LoginFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  return (
    <View className="flex-col items-center gap-12 px-4" testID="login-form">
      <View className="w-full max-w-sm gap-6">
        <View className="gap-2">
          <Text className="font-bold">Your work email</Text>

          <Controller
            control={control}
            name="email"
            rules={EMAIL_VALIDATION}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextInput
                ref={ref}
                style={{
                  borderRadius: 8,
                  padding: 16,
                  backgroundColor: "white",
                  color: colors.foreground.DEFAULT,
                  fontSize: 16,
                }}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="you@company.com"
                placeholderTextColor={colors.gray.DEFAULT}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="send"
                onSubmitEditing={handleSubmit(onSubmit)}
                testID="email-input"
              />
            )}
          />

          {errors.email && (
            <View accessibilityLiveRegion="polite" accessibilityRole="alert">
              <Text className="text-error" testID="email-error">
                {errors.email.message}
              </Text>
            </View>
          )}
        </View>

        <Button
          title="Send magic link"
          onPress={handleSubmit(onSubmit)}
          variant="primary"
          disabled={isSubmitting || !isValid}
          loading={isSubmitting}
          icon="email-fast"
        />

        <IconText
          icon="security"
          text="We'll send a secure access link"
          variant="sm"
        />
      </View>
    </View>
  );
}
