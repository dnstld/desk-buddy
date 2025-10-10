import { RoomWithDetails } from "@/src/types/room";
import {
  defaultRoomFormValues,
  RoomFormData,
  roomFormSchema,
} from "@/src/validations/room-form";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../ui/button";
import Toast from "../ui/toast";

interface RoomFormProps {
  initialData?: Partial<RoomWithDetails>;
  onSubmit: (data: RoomFormData) => Promise<void>;
  onSuccess?: () => void;
  submitButtonText?: string;
  isLoading?: boolean;
}

export default function RoomForm({
  initialData,
  onSubmit,
  onSuccess,
  submitButtonText = "Save Room",
  isLoading = false,
}: RoomFormProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "error"
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RoomFormData>({
    defaultValues: {
      ...defaultRoomFormValues,
      // Convert room data to form data if editing
      ...(initialData && {
        name: initialData.room_name || "",
        description: initialData.description || "",
        totalSeats: initialData.seat_limit || 1,
        meeting: initialData.meeting || false,
        wheelchair: initialData.wheelchair || false,
        elevator: initialData.elevator || false,
        petFriendly: initialData.pet_friendly || false,
        floor: initialData.floor || 1,
        color: initialData.color || "#3B82F6",
      }),
    },
  });

  const watchMeeting = watch("meeting");
  const watchTotalSeats = watch("totalSeats");

  const showToastNotification = (
    message: string,
    type: "success" | "error" | "info" = "error"
  ) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const validateForm = (data: RoomFormData): boolean => {
    try {
      roomFormSchema.parse(data);
      return true;
    } catch (error) {
      console.error("Form validation error:", error);

      // Show specific validation error if available
      if (error instanceof Error && "issues" in error) {
        const zodError = error as any;
        if (zodError.issues && zodError.issues.length > 0) {
          const firstIssue = zodError.issues[0];
          showToastNotification(firstIssue.message, "error");
          return false;
        }
      }

      showToastNotification("Please check the form for errors", "error");
      return false;
    }
  };

  const onFormSubmit = async (data: any) => {
    const formData = data as RoomFormData;

    // Validate using Zod schema
    if (!validateForm(formData)) {
      return;
    }

    try {
      await onSubmit(formData);

      // Reset form if creating new room
      if (!initialData?.id) {
        reset(defaultRoomFormValues);
      }

      // Show success toast first
      const successMessage = initialData?.id
        ? "Room updated successfully!"
        : "Room created successfully!";
      showToastNotification(successMessage, "success");

      // Call success callback after a delay to allow toast to show
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (error) {
      console.error("Failed to save room:", error);

      // Extract error message if available
      let errorMessage = "Failed to save room. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;

        // Log more details for debugging
        console.log("🔍 Error details:", {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
      }

      showToastNotification(errorMessage, "error");
    }
  };

  const handleFormSubmit = handleSubmit(onFormSubmit);

  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <View className="p-4 gap-6">
          {/* Room Name */}
          <View className="gap-2">
            <Text className="text-base font-semibold text-gray-900">
              Room Name *
            </Text>
            <Controller
              control={control}
              name="name"
              rules={{
                required: "Room name is required",
                maxLength: {
                  value: 50,
                  message: "Room name must be less than 50 characters",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`
                    border rounded-lg p-3 text-base
                    ${errors.name ? "border-red-500" : "border-gray-300"}
                  `.trim()}
                  placeholder="Enter room name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  maxLength={50}
                />
              )}
            />
            {errors.name && (
              <Text className="text-red-500 text-sm">
                {errors.name.message}
              </Text>
            )}
          </View>

          {/* Description */}
          <View className="gap-2">
            <Text className="text-base font-semibold text-gray-900">
              Description
            </Text>
            <Controller
              control={control}
              name="description"
              rules={{
                maxLength: {
                  value: 150,
                  message: "Description must be less than 150 characters",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`
                    border rounded-lg p-3 text-base min-h-[80px]
                    ${errors.description ? "border-red-500" : "border-gray-300"}
                  `.trim()}
                  placeholder="Enter room description (optional)"
                  value={value || ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  maxLength={150}
                  multiline
                  textAlignVertical="top"
                />
              )}
            />
            {errors.description && (
              <Text className="text-red-500 text-sm">
                {errors.description.message}
              </Text>
            )}
          </View>

          {/* Room Type Switcher */}
          <View className="gap-4">
            <Text className="text-base font-semibold text-gray-900">
              Room Type
            </Text>
            <Controller
              control={control}
              name="meeting"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => onChange(false)}
                    className={`
                      flex-1 flex-row items-center justify-center p-4 rounded-lg border-2
                      ${
                        !value
                          ? "bg-primary-50 border-primary-500"
                          : "bg-gray-50 border-gray-300"
                      }
                    `.trim()}
                  >
                    <MaterialCommunityIcons
                      name="desk"
                      size={24}
                      color={!value ? "#3B82F6" : "#6B7280"}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      className={`
                        font-medium
                        ${!value ? "text-primary-600" : "text-gray-600"}
                      `.trim()}
                    >
                      Workspace
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => onChange(true)}
                    className={`
                      flex-1 flex-row items-center justify-center p-4 rounded-lg border-2
                      ${
                        value
                          ? "bg-primary-50 border-primary-500"
                          : "bg-gray-50 border-gray-300"
                      }
                    `.trim()}
                  >
                    <MaterialCommunityIcons
                      name="account-group"
                      size={24}
                      color={value ? "#3B82F6" : "#6B7280"}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      className={`
                        font-medium
                        ${value ? "text-primary-600" : "text-gray-600"}
                      `.trim()}
                    >
                      Meeting Room
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          {/* Total Seats */}
          <View className="gap-2">
            <Text className="text-base font-semibold text-gray-900">
              Total Seats *
            </Text>
            <Controller
              control={control}
              name="totalSeats"
              rules={{
                required: "Total seats is required",
                min: {
                  value: 1,
                  message: "Total seats must be at least 1",
                },
                max: {
                  value: 100,
                  message: "Total seats cannot exceed 100",
                },
                validate: (value) => {
                  if (watchMeeting && value < 2) {
                    return "Meeting rooms must have at least 2 seats";
                  }
                  return true;
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`
                    border rounded-lg p-3 text-base
                    ${errors.totalSeats ? "border-red-500" : "border-gray-300"}
                  `.trim()}
                  placeholder={
                    watchMeeting
                      ? "Minimum 2 seats for meeting rooms"
                      : "Enter number of seats"
                  }
                  value={value?.toString() || ""}
                  onChangeText={(text) => {
                    const num = parseInt(text) || 0;
                    onChange(num);
                  }}
                  onBlur={onBlur}
                  keyboardType="numeric"
                />
              )}
            />
            {errors.totalSeats && (
              <Text className="text-red-500 text-sm">
                {errors.totalSeats.message}
              </Text>
            )}
            {watchMeeting && watchTotalSeats < 2 && (
              <Text className="text-amber-600 text-sm">
                Meeting rooms require at least 2 seats
              </Text>
            )}
          </View>

          {/* Floor */}
          <View className="gap-2">
            <Text className="text-base font-semibold text-gray-900">
              Floor *
            </Text>
            <Controller
              control={control}
              name="floor"
              rules={{
                required: "Floor is required",
                min: {
                  value: 1,
                  message: "Floor must be at least 1",
                },
                max: {
                  value: 50,
                  message: "Floor cannot exceed 50",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`
                    border rounded-lg p-3 text-base
                    ${errors.floor ? "border-red-500" : "border-gray-300"}
                  `.trim()}
                  placeholder="Enter floor number"
                  value={value?.toString() || ""}
                  onChangeText={(text) => {
                    const num = parseInt(text) || 1;
                    onChange(num);
                  }}
                  onBlur={onBlur}
                  keyboardType="numeric"
                />
              )}
            />
            {errors.floor && (
              <Text className="text-red-500 text-sm">
                {errors.floor.message}
              </Text>
            )}
          </View>

          {/* Amenities */}
          <View className="gap-4">
            <Text className="text-base font-semibold text-gray-900">
              Amenities
            </Text>

            {/* Wheelchair Accessible */}
            <Controller
              control={control}
              name="wheelchair"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <View className="flex-row items-center gap-3">
                    <MaterialCommunityIcons
                      name="wheelchair-accessibility"
                      size={24}
                      color="#6B7280"
                    />
                    <View>
                      <Text className="text-base font-medium text-gray-900">
                        Wheelchair Accessible
                      </Text>
                      <Text className="text-sm text-gray-600">
                        Accessible for wheelchair users
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
                    thumbColor={value ? "#3B82F6" : "#F3F4F6"}
                  />
                </View>
              )}
            />

            {/* Elevator Access */}
            <Controller
              control={control}
              name="elevator"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <View className="flex-row items-center gap-3">
                    <MaterialCommunityIcons
                      name="elevator"
                      size={24}
                      color="#6B7280"
                    />
                    <View>
                      <Text className="text-base font-medium text-gray-900">
                        Elevator Access
                      </Text>
                      <Text className="text-sm text-gray-600">
                        Accessible by elevator
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
                    thumbColor={value ? "#3B82F6" : "#F3F4F6"}
                  />
                </View>
              )}
            />

            {/* Pet Friendly */}
            <Controller
              control={control}
              name="petFriendly"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <View className="flex-row items-center gap-3">
                    <MaterialCommunityIcons
                      name="dog-side"
                      size={24}
                      color="#6B7280"
                    />
                    <View>
                      <Text className="text-base font-medium text-gray-900">
                        Pet Friendly
                      </Text>
                      <Text className="text-sm text-gray-600">
                        Allows pets in the room
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
                    thumbColor={value ? "#3B82F6" : "#F3F4F6"}
                  />
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="p-4 border-t border-gray-200 bg-white">
        <Button
          title={submitButtonText}
          onPress={handleFormSubmit}
          loading={isSubmitting || isLoading}
          disabled={isSubmitting || isLoading}
          icon="content-save"
          variant="primary"
        />
      </View>

      {/* Toast Notifications */}
      <Toast
        visible={showToast}
        message={toastMessage}
        type={toastType}
        onHide={() => setShowToast(false)}
      />
    </>
  );
}
