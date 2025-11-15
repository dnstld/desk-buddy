import ModalActions from "@/src/components/modal-actions";
import Button from "@/src/components/ui/button";
import { useAmenities } from "@/src/hooks/use-amenities";
import { useUser } from "@/src/hooks/use-user-query";
import { colors } from "@/src/theme/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

interface AmenityCardProps {
  name: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

function AmenityCard({ name, enabled, onToggle }: AmenityCardProps) {
  return (
    <View className="flex-row items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
      <Text className="text-base font-medium flex-1">{name}</Text>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{
          false: colors.gray[300],
          true: colors.primary[200],
        }}
        thumbColor={enabled ? colors.primary.DEFAULT : colors.gray[50]}
      />
    </View>
  );
}

export default function SeatPage() {
  const {
    id: seatIndexParam,
    note: initialNote,
    totalSeats: totalSeatsParam,
    amenities: initialAmenities,
    pendingAmenities: initialPendingAmenities,
  } = useLocalSearchParams<{
    id: string;
    note?: string;
    totalSeats?: string;
    amenities?: string; // JSON string of amenity IDs
    pendingAmenities?: string; // JSON string of pending amenity names
  }>();

  const seatIndex = parseInt(seatIndexParam || "0", 10);
  const seatNumber = seatIndex + 1;
  const totalSeats = parseInt(totalSeatsParam || "1", 10);
  const canDelete = totalSeats > 1;

  // Get user data for company_id
  const { userData } = useUser();
  const companyId = userData?.company_id || null;

  // Fetch all company amenities
  const { data: amenities = [], isLoading: isLoadingAmenities } =
    useAmenities(companyId);

  // Parse initial amenities
  const parsedInitialAmenities = React.useMemo(() => {
    try {
      return initialAmenities ? JSON.parse(initialAmenities) : [];
    } catch {
      return [];
    }
  }, [initialAmenities]);

  const parsedInitialPendingAmenities = React.useMemo(() => {
    try {
      return initialPendingAmenities ? JSON.parse(initialPendingAmenities) : [];
    } catch {
      return [];
    }
  }, [initialPendingAmenities]);

  // State management
  const [specialNote, setSpecialNote] = useState(initialNote || "");
  const [newAmenityName, setNewAmenityName] = useState("");
  const [amenityStates, setAmenityStates] = useState<Record<string, boolean>>(
    {}
  );
  const [pendingNewAmenities, setPendingNewAmenities] = useState<string[]>(
    parsedInitialPendingAmenities
  );
  const [isSaving, setIsSaving] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);

  // Initialize amenity states (set enabled for amenities from seat data)
  useEffect(() => {
    if (amenities.length > 0) {
      setAmenityStates((prevStates) => {
        const newStates = { ...prevStates };
        amenities.forEach((amenity) => {
          // Only initialize if not already set
          if (newStates[amenity.id] === undefined) {
            // Enable if this amenity was enabled for this seat
            newStates[amenity.id] = parsedInitialAmenities.includes(amenity.id);
          }
        });
        return newStates;
      });
    }
  }, [amenities, parsedInitialAmenities]);

  const normalizeAmenityName = (name: string): string => {
    // Remove extra spaces, trim, and convert to lowercase for comparison
    return name.trim().toLowerCase().replace(/\s+/g, " ");
  };

  // Check for duplicates when user types
  useEffect(() => {
    if (!newAmenityName.trim()) {
      setDuplicateError(false);
      return;
    }

    const normalizedInput = normalizeAmenityName(newAmenityName);

    // Check against both existing amenities and pending new ones
    const isDuplicateExisting = amenities.some(
      (amenity) => normalizeAmenityName(amenity.name || "") === normalizedInput
    );

    const isDuplicatePending = pendingNewAmenities.some(
      (name) => normalizeAmenityName(name) === normalizedInput
    );

    setDuplicateError(isDuplicateExisting || isDuplicatePending);
  }, [newAmenityName, amenities, pendingNewAmenities]);

  const handleToggleAmenity = (amenityId: string, value: boolean) => {
    setAmenityStates((prev) => ({
      ...prev,
      [amenityId]: value,
    }));
  };

  const handleAddPendingAmenity = () => {
    if (!newAmenityName.trim() || duplicateError) return;

    const cleanName = newAmenityName.trim().replace(/\s+/g, " ");

    // Add to pending list
    setPendingNewAmenities((prev) => [...prev, cleanName]);

    setNewAmenityName("");
  };

  const handleRemovePendingAmenity = (amenityName: string) => {
    setPendingNewAmenities((prev) =>
      prev.filter((name) => name !== amenityName)
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Collect enabled amenity IDs
      const enabledAmenityIds = Object.entries(amenityStates)
        .filter(([_, enabled]) => enabled)
        .map(([id, _]) => id);

      // Check if amenities have changed
      const amenitiesChanged =
        JSON.stringify(enabledAmenityIds.sort()) !==
        JSON.stringify(parsedInitialAmenities.sort());

      // Check if there are new pending amenities
      const hasPendingAmenities = pendingNewAmenities.length > 0;

      // Mark as having unsaved changes if amenities changed or there are pending amenities
      const hasUnsavedAmenityChanges = amenitiesChanged || hasPendingAmenities;

      // Pass data back via params (saved locally, not to DB yet)
      router.dismiss();
      setTimeout(() => {
        router.setParams({
          seatIndex: seatIndexParam,
          note: specialNote.trim(),
          amenities: JSON.stringify(enabledAmenityIds),
          pendingAmenities: JSON.stringify(pendingNewAmenities),
          hasUnsavedAmenityChanges: hasUnsavedAmenityChanges ? "true" : "false",
          action: "save",
        });
      }, 100);
    } catch (error) {
      console.error("Unexpected error saving seat:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSeat = () => {
    router.dismiss();
    setTimeout(() => {
      router.setParams({
        seatIndex: seatIndexParam,
        action: "delete",
      });
    }, 100);
  };

  const handleCancel = () => {
    router.dismiss();
  };

  const hasSpecialNote = specialNote.trim().length > 0;

  return (
    <>
      <Stack.Screen
        options={{
          title: `Seat ${seatNumber}`,
          headerShown: true,
          presentation: "modal",
        }}
      />
      <View className="flex-1 bg-background">
        <ScrollView className="flex-1">
          <View className="p-8 gap-6 pb-32">
            {/* Special Note Section */}
            <View className="gap-4">
              <Text className="text-lg font-semibold text-gray-900">
                Special Note
              </Text>

              {/* Avatar Preview */}
              <View className="bg-white rounded-lg shadow-sm p-5 gap-3 border border-gray-200">
                <View className="flex-row items-center gap-4">
                  <View className="w-16 h-16 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100 relative">
                    <View
                      className={`w-full h-full items-center justify-center ${
                        hasSpecialNote ? "bg-yellow-50" : "bg-primary-50"
                      }`}
                    >
                      <MaterialCommunityIcons
                        name="seat"
                        size={28}
                        color={colors.gray.DEFAULT}
                      />
                    </View>
                    {hasSpecialNote && (
                      <View className="absolute -top-1 -right-1 bg-yellow-500 rounded-full w-6 h-6 items-center justify-center border-2 border-white">
                        <MaterialCommunityIcons
                          name="pencil"
                          size={12}
                          color="white"
                        />
                      </View>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-muted-foreground leading-5">
                      {hasSpecialNote
                        ? "This seat has a special note. Users will see this information first when booking."
                        : "Add a note to highlight special characteristics of this seat."}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Special Note Input */}
              <TextInput
                value={specialNote}
                onChangeText={setSpecialNote}
                placeholder="E.g., Near window, Adjustable standing desk, Quiet zone..."
                multiline
                numberOfLines={3}
                maxLength={150}
                className="border border-input rounded-lg p-4 text-base text-foreground bg-white"
                textAlignVertical="top"
              />
              <Text className="text-xs text-muted-foreground text-right">
                {specialNote.length}/150 characters
              </Text>
            </View>

            {/* Seat Features Section */}
            <View className="gap-4 border-t border-gray-200 pt-6">
              <Text className="text-lg font-semibold text-gray-900">
                Seat Features
              </Text>

              {/* Add New Amenity Input */}
              <View className="gap-3">
                <View className="flex-row gap-2">
                  <View className="flex-1">
                    <TextInput
                      value={newAmenityName}
                      onChangeText={setNewAmenityName}
                      placeholder="Type a new feature (e.g., Ergonomic chair)"
                      className={`border rounded-lg p-4 text-base text-foreground bg-white ${
                        duplicateError ? "border-red-500" : "border-input"
                      }`}
                      maxLength={50}
                      onSubmitEditing={handleAddPendingAmenity}
                    />
                    {duplicateError && (
                      <Text className="text-xs text-red-600 mt-1 ml-1">
                        This feature already exists
                      </Text>
                    )}
                  </View>
                  <Button
                    title="Add"
                    onPress={handleAddPendingAmenity}
                    disabled={!newAmenityName.trim() || duplicateError}
                    icon="plus"
                    variant="primary"
                  />
                </View>
                <Text className="text-xs text-muted-foreground">
                  New features will be saved to the database when you save the
                  room
                </Text>
              </View>

              {/* Amenity Cards */}
              {isLoadingAmenities ? (
                <View className="py-8 items-center">
                  <ActivityIndicator
                    size="large"
                    color={colors.primary.DEFAULT}
                  />
                </View>
              ) : amenities.length === 0 && pendingNewAmenities.length === 0 ? (
                <View className="bg-gray-50 rounded-lg p-6 items-center">
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={24}
                    color={colors.gray.DEFAULT}
                  />
                  <Text className="text-sm text-gray mt-2 text-center">
                    No features yet. Add your first seat feature above!
                  </Text>
                </View>
              ) : (
                <View className="gap-3">
                  {/* Existing amenities from database */}
                  {amenities.map((amenity) => (
                    <AmenityCard
                      key={amenity.id}
                      name={amenity.name || "Unnamed feature"}
                      enabled={amenityStates[amenity.id] || false}
                      onToggle={(value) =>
                        handleToggleAmenity(amenity.id, value)
                      }
                    />
                  ))}

                  {/* Pending new amenities (not yet saved to DB) */}
                  {pendingNewAmenities.map((amenityName, index) => {
                    const tempId = `temp-${index}`;
                    return (
                      <View
                        key={tempId}
                        className="flex-row items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-300"
                      >
                        <View className="flex-row items-center gap-2 flex-1">
                          <MaterialCommunityIcons
                            name="clock-outline"
                            size={20}
                            color="#d97706"
                          />
                          <Text className="text-base font-medium flex-1">
                            {amenityName}
                          </Text>
                        </View>
                        <Button
                          title=""
                          onPress={() =>
                            handleRemovePendingAmenity(amenityName)
                          }
                          icon="close"
                          variant="ghost"
                        />
                      </View>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Delete Seat Section */}
            {canDelete && (
              <View className="border-t border-gray-200 pt-6">
                <Text className="text-base font-semibold text-foreground mb-2">
                  Danger Zone
                </Text>
                <Text className="text-sm text-muted-foreground mb-4">
                  Remove this seat from the room permanently.
                </Text>
                <Button
                  title="Delete Seat"
                  onPress={handleDeleteSeat}
                  variant="danger"
                  icon="delete"
                />
              </View>
            )}
          </View>
        </ScrollView>

        {/* Modal Actions */}
        <ModalActions
          onCancel={handleCancel}
          onSubmit={handleSave}
          submitText="Save Seat"
          submitIcon="check"
          disabled={isSaving}
        />
      </View>
    </>
  );
}
