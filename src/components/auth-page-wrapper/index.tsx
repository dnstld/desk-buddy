import Text from "@/src/components/ui/text";
import { colors } from "@/src/theme/colors";
import { Link } from "expo-router";
import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import IconText from "../ui/icon-text";

type AuthPageWrapperProps = {
  children: ReactNode;
  variant?: "default" | "success" | "error";
};

export default function AuthPageWrapper({
  children,
  variant = "default",
}: AuthPageWrapperProps) {
  const year = new Date().getFullYear();

  const backgroundColors = {
    default: colors.background.DEFAULT,
    success: colors.success.DEFAULT,
    error: colors.error.DEFAULT,
  } as const;

  const variantConfig = {
    default: {
      icon: "login" as const,
      text: "Sign in",
    },
    success: {
      icon: "email-check" as const,
      text: "Check your inbox",
    },
    error: {
      icon: "logout" as const,
      text: "Logged out",
    },
  };

  const { icon, text } = variantConfig[variant];

  const maxWidthClass = variant === "default" ? "max-w-sm" : "max-w-xs";

  return (
    <View style={{ flex: 1, backgroundColor: backgroundColors[variant] }}>
      <ScrollView
        contentContainerClassName={`flex-1 flex-col justify-around items-center w-full ${maxWidthClass} mx-auto`}
        keyboardShouldPersistTaps="handled"
      >
        <IconText icon={icon} text={text} />

        <View className={`w-full ${maxWidthClass} gap-8`}>{children}</View>

        <View>
          <View className="flex-row gap-2 mb-2 justify-center items-center">
            <Link href="/how-it-works" className="text-base font-bold">
              How it works
            </Link>
            <Text aria-hidden={true}> · </Text>
            <Link href="/privacy" className="text-base font-bold">
              Privacy
            </Link>
            <Text aria-hidden={true}> · </Text>
            <Link href="/terms" className="text-base font-bold">
              Terms
            </Link>
          </View>
          <Text className="text-sm text-center">© {year} detoledo</Text>
        </View>
      </ScrollView>
    </View>
  );
}
