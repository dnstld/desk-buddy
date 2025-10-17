import RoomForm from "@/src/components/room-form";
import { useRoomMutations } from "@/src/hooks/use-room-mutations";
import { logger } from "@/src/utils/logger";
import { RoomFormData } from "@/src/validations/room-form";
import { router } from "expo-router";
import { View } from "react-native";

export default function CreateRoom() {
  const { createRoom } = useRoomMutations();

  const handleSubmit = async (data: RoomFormData) => {
    try {
      logger.info("Creating room with data:", data);

      // Create the room using Supabase
      await createRoom(data);

      logger.success("Room created successfully!");
    } catch (error) {
      logger.error("Failed to create room:", error);
      throw error; // Re-throw to let RoomForm handle the error display
    }
  };

  const handleSuccess = () => {
    router.replace("/(app)/rooms/" as any);

    logger.success("Room created successfully! (Navigation completed)");
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
