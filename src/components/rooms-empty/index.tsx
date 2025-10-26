import { useUser } from "@/providers/UserProvider";
import { mockRooms } from "@/src/constants/mock-rooms";
import React from "react";
import { Text, View } from "react-native";
import InfoCards, { type InfoCard } from "../info-cards";
import Room from "../room";

const infoCards: InfoCard[] = [
  {
    id: "welcome",
    title: "👋 Here's how it works",
    description:
      "Create and manage two types of rooms: Workspaces and Meeting Rooms. Once published, these rooms will be available for everyone to book a seat. See the example rooms below!",
  },
  {
    id: "manager",
    icon: "account-tie-woman" as const,
    title: "Add Managers",
    description:
      "Need help managing your rooms? You can add other users as managers who can assist with room administration tasks",
  },
  {
    id: "ownership",
    icon: "crown" as const,
    title: "Transfer Ownership",
    description:
      "To transfer ownership to someone else, simply select the user and designate them as the new owner. You will then become a regular member",
  },
];

export default function RoomsEmpty() {
  const { isMember } = useUser();

  return (
    <>
      {isMember ? (
        <View>
          <Text className="text-white">Intro screen for members</Text>
        </View>
      ) : (
        <View className="gap-6">
          <InfoCards cards={infoCards} />

          {mockRooms.map((room) => (
            <Room key={room.id} room={room} showActions={false} />
          ))}
        </View>
      )}
    </>
  );
}
