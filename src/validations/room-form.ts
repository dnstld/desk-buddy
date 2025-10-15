import { FLOOR_CONFIG, SEATS_CONFIG, VALIDATION } from "@/src/constants/config";
import { z } from "zod";

export const roomFormSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.ROOM_NAME.MIN, "Room name is required")
    .max(VALIDATION.ROOM_NAME.MAX, `Room name must be less than ${VALIDATION.ROOM_NAME.MAX} characters`),
  
  description: z
    .string()
    .max(VALIDATION.ROOM_DESCRIPTION.MAX, `Description must be less than ${VALIDATION.ROOM_DESCRIPTION.MAX} characters`)
    .optional(),
  
  meeting: z.boolean(),
  
  totalSeats: z
    .number({ message: "Total seats is required" })
    .int("Total seats must be a whole number")
    .min(SEATS_CONFIG.MIN, `Total seats must be at least ${SEATS_CONFIG.MIN}`)
    .max(SEATS_CONFIG.MAX, `Total seats cannot exceed ${SEATS_CONFIG.MAX}`),
  
  // Amenities
  wheelchair: z.boolean(),
  elevator: z.boolean(),
  petFriendly: z.boolean(),
  
  // Additional fields that might be needed
  floor: z
    .number({ message: "Floor is required" })
    .int("Floor must be a whole number")
    .min(FLOOR_CONFIG.MIN, `Floor must be at least B${Math.abs(FLOOR_CONFIG.MIN)}`)
    .max(FLOOR_CONFIG.MAX, `Floor cannot exceed ${FLOOR_CONFIG.MAX}`),
    
  color: z.string(),
})
.refine((data) => {
  // Meeting rooms must have at least 2 seats
  if (data.meeting && data.totalSeats < VALIDATION.MIN_MEETING_SEATS) {
    return false;
  }
  return true;
}, {
  message: `Meeting rooms must have at least ${VALIDATION.MIN_MEETING_SEATS} seats`,
  path: ["totalSeats"],
});

export type RoomFormData = z.infer<typeof roomFormSchema>;

// Default values for the form
export const defaultRoomFormValues: RoomFormData = {
  name: "",
  description: "",
  meeting: false,
  totalSeats: 1,
  wheelchair: false,
  elevator: false,
  petFriendly: false,
  floor: 0,
  color: "#3B82F6",
};
