import Text from "@/src/components/ui/text";
import { mockRooms } from "@/src/shared/constants/mock-rooms";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import Room from "../room";
import Button from "@/src/components/ui/button";

export default function RoomsEmpty() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <ScrollView>
      {!showDemo ? (
        <View className="items-center gap-4 p-8">
          <View className="w-24 h-24 bg-primary rounded-full justify-center items-center">
            <MaterialCommunityIcons
              name="office-building-outline"
              size={42}
              color="white"
            />
          </View>

          <View className="gap-2">
            <Text variant="2xl" className="font-bold text-white text-center">
              Create your first room
            </Text>
            <Text className="text-white/80 text-center leading-6">
              Once you create a room, you can update its details before
              publishing it. Once published, it becomes available for
              reservations
            </Text>
          </View>

          <Button
            title={`View Demo Rooms (${mockRooms.length})`}
            onPress={() => setShowDemo(true)}
            variant="secondary"
            size="md"
            icon="eye-outline"
          />
        </View>
      ) : (
        <View className="gap-4">
          <View className="gap-4 mt-2">
            {mockRooms.map((room) => (
              <Room key={room.id} room={room} showActions={false} />
            ))}
          </View>
          <Button
            title="Hide Demo Rooms"
            onPress={() => setShowDemo(false)}
            variant="secondary"
            size="md"
            icon="close"
          />
        </View>
      )}
    </ScrollView>
  );
}
