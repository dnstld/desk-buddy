import RoomForm from "@/src/components/room-form";
import { RoomFormData } from "@/src/validations/room-form";
import { router } from "expo-router";
import { View } from "react-native";

export default function CreateRoom() {
  const handleSubmit = async (data: RoomFormData) => {
    try {
      // Here you would call your API to create the room
      console.log("Creating room with data:", data);

      // Simulate API call with potential failure (for testing error handling)
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate success most of the time, but occasionally fail for testing
          const shouldSucceed = Math.random() > 0.2; // 80% success rate
          if (shouldSucceed) {
            console.log("✅ Simulated API success");
            resolve(true);
          } else {
            console.log(
              "❌ Simulated API failure (this is expected for testing)"
            );
            reject(new Error("Server error: Unable to create room"));
          }
        }, 1000);
      });
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
