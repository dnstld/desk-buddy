import Text from "@/src/components/ui/text";
import { View } from "react-native";

import LogoIllustration from "./illustration";
import Laptop from "./laptop";
import Workspacey from "./workspacey";

const SIZES = {
  small: {
    illustration: 122,
    laptop: 99,
  },
  medium: {
    illustration: 200,
    laptop: 164,
  },
  large: {
    illustration: 300,
    laptop: 250,
  },
} as const;

interface LogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  accessibilityLabel?: string;
}

const Logo = ({
  size = "small",
  showText,
  accessibilityLabel = "Workspacey logo",
}: LogoProps) => {
  const sizes = SIZES[size];
  const shouldShowText = showText ?? size === "small";

  return (
    <View
      className="gap-4"
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <View className="relative items-center">
        <LogoIllustration
          className="relative left-1/2 -translate-x-1/2"
          width={sizes.illustration}
        />
        <View className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
          <Laptop width={sizes.laptop} />
        </View>
      </View>
      {shouldShowText && (
        <>
          <View className="items-center">
            <Workspacey />
          </View>
          <Text className="text-base text-center">Easy workspace booking</Text>
        </>
      )}
    </View>
  );
};

export default Logo;
