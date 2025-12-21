import { FLOOR_CONFIG, SEATS_CONFIG, VALIDATION } from "@/src/shared/constants/config";
import { z } from "zod";

// Seat schema - simplified
export const seatSchema = z.object({
  id: z.string().optional(), // For editing existing seats
  number: z.number().int().min(1),
  isSpecial: z.boolean(),
  note: z.string().max(VALIDATION.ROOM_DESCRIPTION.MAX, `Note must be less than ${VALIDATION.ROOM_DESCRIPTION.MAX} characters`).optional(),
  amenities: z.array(z.string()).optional(), // Array of amenity IDs that are enabled
  pendingAmenities: z.array(z.string()).optional(), // Array of new amenity names to create
  hasUnsavedAmenityChanges: z.boolean().optional(), // Flag to indicate if amenities were modified
});

export type SeatFormData = z.infer<typeof seatSchema>;

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
    .number()
    .int("Total seats must be a whole number")
    .min(1, "Must have at least 1 seat")
    .max(SEATS_CONFIG.MAX, `Total seats cannot exceed ${SEATS_CONFIG.MAX}`),
  
  seats: z.array(seatSchema),
  
  // Amenities
  wheelchair: z.boolean(),
  elevator: z.boolean(),
  petFriendly: z.boolean(),
  
  // Additional fields
  floor: z
    .number({ message: "Floor is required" })
    .int("Floor must be a whole number")
    .min(FLOOR_CONFIG.MIN, `Floor must be at least B${Math.abs(FLOOR_CONFIG.MIN)}`)
    .max(FLOOR_CONFIG.MAX, `Floor cannot exceed ${FLOOR_CONFIG.MAX}`),
    
  color: z.string(),
})
.refine(
  (data) => {
    // Meeting rooms must have at least 2 seats
    if (data.meeting) {
      return data.totalSeats >= 2;
    }
    return true;
  },
  {
    message: "Meeting rooms must have at least 2 seats",
    path: ["totalSeats"],
  }
)
.refine(
  (data) => {
    // All special seats must have notes
    return data.seats.every(seat => !seat.isSpecial || (seat.note && seat.note.length > 0));
  },
  {
    message: "Special seats must have a note",
    path: ["seats"],
  }
);

export type RoomFormData = z.infer<typeof roomFormSchema>;

// Default values for the form
export const defaultRoomFormValues: RoomFormData = {
  name: "",
  description: "",
  meeting: false,
  totalSeats: 1,
  seats: [{ number: 1, isSpecial: false, note: "" }],
  wheelchair: false,
  elevator: false,
  petFriendly: false,
  floor: 0,
  color: "#3B82F6",
};
