import { useFloorOptions } from "@/src/hooks";
import { RoomWithDetails } from "@/src/types/room";
import {
  defaultRoomFormValues,
  RoomFormData,
  roomFormSchema,
} from "@/src/validations/room-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { ScrollView, Text, TextInput, View } from "react-native";
import ModalActions from "../modal-actions";
import Tabs, { TabsRef } from "../ui/tabs";
import AmenitiesSection from "./AmenitiesSection";
import PickerField from "./PickerField";
import RoomTypeSelector from "./RoomTypeSelector";
import SeatsSection from "./SeatsSection";

interface RoomFormProps {
  initialData?: Partial<RoomWithDetails>;
  onSubmit: (data: RoomFormData) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  submitButtonText?: string;
  isLoading?: boolean;
}
export default function RoomForm({
  initialData,
  onSubmit,
  onSuccess,
  onError,
  onCancel,
  submitButtonText = "Save",
  isLoading = false,
}: RoomFormProps) {
  const floorOptions = useFloorOptions();
  const tabsRef = useRef<TabsRef>(null);

  // Convert existing room data to new format
  const getInitialSeatsData = () => {
    if (!initialData?.seats || initialData.seats.length === 0) {
      return {
        totalSeats: 1,
        seats: [{ number: 1, isSpecial: false, note: "" }],
      };
    }

    const seats = initialData.seats.map((seat) => {
      // Extract enabled amenity IDs from seat_amenities
      const amenities =
        seat.seat_amenities
          ?.filter((sa: any) => sa.enabled)
          .map((sa: any) => sa.amenity_id) || [];

      return {
        id: seat.id,
        number: seat.number,
        isSpecial: !!(seat.note && seat.note.length > 0),
        note: seat.note || "",
        amenities,
      };
    });

    return {
      totalSeats: initialData.seats.length,
      seats,
    };
  };

  const initialSeatsData = getInitialSeatsData();

  const formMethods = useForm<RoomFormData>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      ...defaultRoomFormValues,
      ...(initialData && {
        name: initialData.name || "",
        description: initialData.description || "",
        totalSeats: initialSeatsData.totalSeats,
        seats: initialSeatsData.seats,
        meeting: initialData.type === "meeting",
        wheelchair: initialData.wheelchair_accessible || false,
        elevator: initialData.has_elevator || false,
        petFriendly: initialData.pet_friendly || false,
        floor: initialData.floor || 1,
        color: "#f78509",
      }),
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = formMethods;

  const onFormSubmit = async (data: RoomFormData) => {
    try {
      await onSubmit(data);

      if (!initialData?.id) {
        reset(defaultRoomFormValues);
      }

      onSuccess?.();
    } catch (error) {
      console.error("[RoomForm] Error saving room:", error);
      onError?.(
        error instanceof Error ? error : new Error("Failed to save room")
      );
    }
  };

  const handleFormSubmit = handleSubmit(onFormSubmit, (errors) => {
    // This callback is called when validation fails
    // Switch to the first tab with errors
    if (
      errors.name ||
      errors.description ||
      errors.meeting ||
      errors.floor ||
      errors.wheelchair ||
      errors.elevator ||
      errors.petFriendly
    ) {
      tabsRef.current?.setActiveTab("room");
    } else if (errors.totalSeats || errors.seats) {
      tabsRef.current?.setActiveTab("seats");
    }
  });

  const roomTab = (
    <ScrollView className="flex-1">
      <View className="p-8 gap-4">
        {/* Room Name */}
        <View className="gap-2">
          <Text className="text-base font-semibold">Room Name</Text>
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
                  border rounded-lg p-4 text-base bg-white
                  ${errors.name ? "border-error" : "border-gray-200"}
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
            <Text className="text-error text-sm">{errors.name.message}</Text>
          )}
        </View>

        {/* Description */}
        <View className="gap-2">
          <Text className="text-base font-semibold">Description</Text>
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
                  border rounded-lg p-3 text-base bg-white h-24
                  ${errors.description ? "border-error" : "border-gray-200"}
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
            <Text className="text-error text-sm">
              {errors.description.message}
            </Text>
          )}
        </View>

        {/* Room Type Switcher */}
        <Controller
          control={control}
          name="meeting"
          render={({ field: { onChange, value } }) => (
            <RoomTypeSelector value={value} onChange={onChange} />
          )}
        />

        {/* Floor */}
        <Controller
          control={control}
          name="floor"
          rules={{ required: "Floor is required" }}
          render={({ field: { onChange, value } }) => (
            <PickerField
              label="Floor"
              value={value}
              options={floorOptions}
              onChange={onChange}
              error={errors.floor?.message}
            />
          )}
        />

        {/* Amenities */}
        <AmenitiesSection
          wheelchair={watch("wheelchair")}
          elevator={watch("elevator")}
          petFriendly={watch("petFriendly")}
          onWheelchairChange={(value) =>
            formMethods.setValue("wheelchair", value)
          }
          onElevatorChange={(value) => formMethods.setValue("elevator", value)}
          onPetFriendlyChange={(value) =>
            formMethods.setValue("petFriendly", value)
          }
        />
      </View>
    </ScrollView>
  );

  const seatsTab = <SeatsSection />;

  const totalSeats = watch("totalSeats");

  // Check for errors in each tab
  const roomTabHasErrors = !!(
    errors.name ||
    errors.description ||
    errors.meeting ||
    errors.floor ||
    errors.wheelchair ||
    errors.elevator ||
    errors.petFriendly
  );

  const seatsTabHasErrors = !!(errors.totalSeats || errors.seats);

  return (
    <FormProvider {...formMethods}>
      <Tabs
        ref={tabsRef}
        tabs={[
          {
            id: "room",
            label: "Room",
            content: roomTab,
            hasError: roomTabHasErrors,
          },
          {
            id: "seats",
            label: `Seats (${totalSeats})`,
            content: seatsTab,
            hasError: seatsTabHasErrors,
          },
        ]}
      />

      {/* Submit Button */}
      <ModalActions
        onCancel={onCancel}
        onSubmit={handleFormSubmit}
        submitText={submitButtonText}
        submitVariant="primary"
        submitIcon="content-save"
        isLoading={isSubmitting || isLoading}
      />
    </FormProvider>
  );
}
