import AuthPageWrapper from "@/src/components/features/auth/auth-page-wrapper";
import Logo from "@/src/components/features/auth/logo";
import Button from "@/src/components/ui/button";
import Text from "@/src/components/ui/text";
import { View } from "react-native";

interface AuthMessageProps {
  variant: "success" | "error";
  title: string;
  message: string;
  email?: string;
  buttonLabel: string;
  buttonDisabled?: boolean;
  onButtonPress: () => void;
}

export default function AuthMessage({
  variant,
  title,
  message,
  email,
  buttonLabel,
  buttonDisabled = false,
  onButtonPress,
}: AuthMessageProps) {
  return (
    <AuthPageWrapper variant={variant}>
      <Logo size="medium" />

      <View className="gap-4">
        <Text className="text-2xl font-bold text-center">{title}</Text>

        <View>
          <Text className="text-center">{message}</Text>
          {email && <Text className="text-center font-bold">{email}</Text>}
          {variant === "success" && (
            <Text className="text-base text-center mt-4">
              Didn't get it? Check spam or resend the link
            </Text>
          )}
        </View>

        <Button
          onPress={onButtonPress}
          title={buttonLabel}
          disabled={buttonDisabled}
          variant="ghost"
          icon="email-sync"
        />
      </View>
    </AuthPageWrapper>
  );
}
