import { useUser } from "@/providers/UserProvider";
import { useRoom } from "@/src/hooks";
import { RoomWithDetails } from "@/src/types/room";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import SeatGrid from "../seat-grid";
import Button from "../ui/button";
import Chip from "../ui/chip";
import ProgressBar from "../ui/progress-bar";

interface RoomProps {
  room: RoomWithDetails;
  showActions?: boolean;
}

export default function Room({ room, showActions = true }: RoomProps) {
  const {
    name,
    seats,
    meeting,
    description,
    floor,
    wheelchair,
    elevator,
    pet_friendly,
    percentOccupied,
    roomStatus,
    occupancyText,
    hasAmenities,
  } = useRoom(room);

  const { isMember } = useUser();

  const handleEdit = () => {
    router.push(`/(app)/rooms/edit/${room.id}` as any);
  };

  const handlePublish = () => {
    router.push(`/(app)/rooms/publish/${room.id}` as any);
  };

  const handleDelete = () => {
    router.push(`/(app)/rooms/delete/${room.id}` as any);
  };

  return (
    <View className="bg-background-50 rounded-lg shadow-sm p-4 gap-4">
      {/* Admin actions */}
      {!isMember && showActions && (
        <View className="flex-row justify-end items-center gap-4 mb-2">
          <Button
            title="Delete"
            icon="delete"
            variant="danger-ghost"
            onPress={handleDelete}
            className="mr-auto"
          />
          <Button
            title="Edit"
            icon="pencil"
            variant="primary-outline"
            onPress={handleEdit}
          />
          {!room.published && (
            <Button
              title="Publish"
              icon="publish"
              variant="success"
              onPress={handlePublish}
            />
          )}
        </View>
      )}

      <View className="flex-row gap-8">
        {/* 3 of 10 seats available */}
        <View className="flex-1 gap-2">
          <View className="flex-row gap-2 items-center">
            <MaterialCommunityIcons name="seat" />
            <Text className="text-sm text-gray">{occupancyText}</Text>
          </View>

          <ProgressBar progress={percentOccupied} />

          {/* Badges and floor */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Chip
                label={meeting ? "Meeting Room" : "Workspace"}
                variant="primary"
              />
              <Chip label={roomStatus.label} variant={roomStatus.variant} />
            </View>

            <Text className="text-xs text-gray">Floor {floor}</Text>
          </View>
        </View>
      </View>

      {/* Room name */}
      <View>
        <Text className="text-2xl font-bold leading-tight flex-1 mb-2">
          {name}
        </Text>

        {description && (
          <Text className="text-sm text-gray" numberOfLines={3}>
            {description}
          </Text>
        )}
      </View>

      {/* Seats */}
      <View className="bg-white rounded-lg shadow-sm">
        <SeatGrid seats={seats} meeting={meeting} />
      </View>

      {hasAmenities && (
        <View className="flex-row items-center gap-2 border-gray-100 flex-wrap">
          {wheelchair && (
            <Chip
              label="Accessible"
              variant="outline"
              icon={
                <MaterialCommunityIcons
                  name="wheelchair-accessibility"
                  size={16}
                  color="#6B7280"
                />
              }
            />
          )}
          {elevator && (
            <Chip
              label="Elevator"
              variant="outline"
              icon={
                <MaterialCommunityIcons
                  name="elevator"
                  size={16}
                  color="#6B7280"
                />
              }
            />
          )}
          {pet_friendly && (
            <Chip
              label="Pet Friendly"
              variant="outline"
              icon={
                <MaterialCommunityIcons
                  name="dog-side"
                  size={16}
                  color="#6B7280"
                />
              }
            />
          )}
        </View>
      )}
    </View>
  );
}
