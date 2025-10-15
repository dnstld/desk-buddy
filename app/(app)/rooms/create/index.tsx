import RoomForm from "@/src/components/room-form";
import { useRoomMutations } from "@/src/hooks/use-room-mutations";
import { RoomFormData } from "@/src/validations/room-form";
import { router } from "expo-router";
import { View } from "react-native";

export default function CreateRoom() {
  const { createRoom } = useRoomMutations();

  const handleSubmit = async (data: RoomFormData) => {
    try {
      console.log("Creating room with data:", data);

      // Create the room using Supabase
      await createRoom(data);

      console.log("✅ Room created successfully!");
    } catch (error) {
      console.error("Failed to create room:", error);
      throw error; // Re-throw to let RoomForm handle the error display
    }
  };

  const handleSuccess = () => {
    // Navigate back with success parameters
    router.back();

    // TODO: In a real app, you could:
    // 1. Use navigation state to pass success message
    // 2. Use a global state management solution
    // 3. Show the toast on the destination screen
    console.log("✅ Room created successfully! (Navigation completed)");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <RoomForm
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </View>
  );
}
