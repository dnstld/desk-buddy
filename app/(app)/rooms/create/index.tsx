import { useToast } from "@/providers/ToastProvider";
import RoomForm from "@/src/components/room-form";
import { useRoomMutations } from "@/src/hooks";
import { RoomFormData } from "@/src/validations/room-form";
import { router } from "expo-router";
import { View } from "react-native";

export default function CreateRoom() {
  const { createRoom } = useRoomMutations();
  const { showError, showSuccess } = useToast();

  const handleSubmit = async (data: RoomFormData) => {
    await createRoom(data);
  };

  const handleSuccess = () => {
    showSuccess("Room created successfully!");
    router.replace("/(app)/rooms");
  };

  const handleError = (error: Error) => {
    showError(error.message || "Failed to create room");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-background-100">
      <RoomForm
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        onError={handleError}
        onCancel={handleCancel}
      />
    </View>
  );
}
