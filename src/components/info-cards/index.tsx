import { colors } from "@/src/theme/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { ComponentProps, useRef, useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_PADDING = 16;
const CARD_WIDTH = SCREEN_WIDTH - CARD_PADDING * 4;

export interface InfoCard {
  id: string;
  icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  description: string;
}

interface InfoCardsProps {
  cards: InfoCard[];
}

export default function InfoCards({ cards }: InfoCardsProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / CARD_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View className="-ml-4 -mr-4">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH}
        snapToAlignment="start"
        contentContainerClassName="px-4 gap-4"
      >
        {cards.map((card) => (
          <View
            key={card.id}
            className={`bg-primary-950 rounded-lg p-4 gap-2 border border-primary`}
            style={{ width: CARD_WIDTH - CARD_PADDING }}
          >
            <View className="gap-2 flex-row items-center">
              {card.icon && (
                <MaterialCommunityIcons
                  name={card.icon}
                  size={24}
                  color={colors.primary[100]}
                />
              )}
              <Text className="text-xl font-bold text-white">{card.title}</Text>
            </View>
            <Text className="text-base text-primary-300 leading-relaxed">
              {card.description}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row justify-center gap-2 mt-4">
        {cards.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex ? "bg-primary w-6" : "bg-gray-700 w-2"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
