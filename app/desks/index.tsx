import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Desks() {
  const handleCreateDesk = () => {
    router.push("/desks/create");
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-blue-500">Desks</Text>
      </View>

      <TouchableOpacity
        onPress={handleCreateDesk}
        className="absolute bottom-8 right-8 bg-blue-500 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Text className="text-white text-4xl font-bold">+</Text>
      </TouchableOpacity>
    </View>
  );
}
