import { useToast } from "@/providers/ToastProvider";
import RoomForm from "@/src/components/features/rooms/room-form";
import { useCreateRoomMutation } from "@/src/hooks";
import { RoomFormData } from "@/src/shared/validations/room-form";
import { router } from "expo-router";
import { View } from "react-native";

export default function CreateRoom() {
  const createRoom = useCreateRoomMutation();
  const { showError, showSuccess } = useToast();

  const handleSubmit = async (data: RoomFormData) => {
    await createRoom.mutateAsync(data);
  };

  const handleSuccess = () => {
    showSuccess("Room created successfully!");
    router.replace("/(tabs)/rooms");
  };

  const handleError = (error: Error) => {
    showError(error.message || "Failed to create room");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-background-50">
      <RoomForm
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        onError={handleError}
        onCancel={handleCancel}
      />
    </View>
  );
}
