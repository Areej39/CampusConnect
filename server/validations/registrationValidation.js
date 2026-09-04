import { z } from "zod";
import mongoose from "mongoose";

export const registrationParamsSchema = z.object({
  eventId: z
    .string()
    .refine(
      (value) => mongoose.Types.ObjectId.isValid(value),
      "Invalid event ID"
    ),
});