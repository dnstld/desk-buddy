import { z } from "zod";

export const roomFormSchema = z.object({
  name: z
    .string()
    .min(1, "Room name is required")
    .max(50, "Room name must be less than 50 characters"),
  
  description: z
    .string()
    .max(150, "Description must be less than 150 characters")
    .optional(),
  
  meeting: z.boolean(),
  
  totalSeats: z
    .number({ message: "Total seats is required" })
    .int("Total seats must be a whole number")
    .min(1, "Total seats must be at least 1")
    .max(100, "Total seats cannot exceed 100"),
  
  // Amenities
  wheelchair: z.boolean(),
  elevator: z.boolean(),
  petFriendly: z.boolean(),
  
  // Additional fields that might be needed
  floor: z
    .number({ message: "Floor is required" })
    .int("Floor must be a whole number")
    .min(1, "Floor must be at least 1")
    .max(50, "Floor cannot exceed 50"),
    
  color: z.string(),
})
.refine((data) => {
  // Meeting rooms must have at least 2 seats
  if (data.meeting && data.totalSeats < 2) {
    return false;
  }
  return true;
}, {
  message: "Meeting rooms must have at least 2 seats",
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
  floor: 1,
  color: "#3B82F6",
};
