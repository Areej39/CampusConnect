import { z } from "zod";

const eventCategories = [
  "sports",
  "workshop",
  "seminar",
  "competition",
  "cultural",
];

const eventStatuses = [
  "draft",
  "published",
  "cancelled",
  "completed",
];

const eventFields = {
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),

  category: z.enum(eventCategories, {
    error: "Invalid event category",
  }),

  date: z
    .string()
    .datetime({
      message: "Please provide a valid event date",
    }),

  registrationDeadline: z
    .string()
    .datetime({
      message: "Please provide a valid registration deadline",
    }),

  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters")
    .max(200, "Location cannot exceed 200 characters"),

  capacity: z
    .number({
      error: "Capacity must be a number",
    })
    .int("Capacity must be a whole number")
    .positive("Capacity must be greater than 0"),

  registrationFee: z
    .number({
      error: "Registration fee must be a number",
    })
    .min(0, "Registration fee cannot be negative")
    .default(0),

  status: z
    .enum(eventStatuses, {
      error: "Invalid event status",
    })
    .default("draft"),
};

export const createEventSchema = z
  .object(eventFields)
  .superRefine((data, ctx) => {
    const eventDate = new Date(data.date);
    const deadlineDate = new Date(
      data.registrationDeadline
    );

    if (deadlineDate >= eventDate) {
      ctx.addIssue({
        code: "custom",
        path: ["registrationDeadline"],
        message:
          "Registration deadline must be before the event date",
      });
    }
  });

export const updateEventSchema = z
  .object({
    ...eventFields,
  })
  .partial()
  .superRefine((data, ctx) => {
    if (data.registrationDeadline && data.date) {
      const eventDate = new Date(data.date);
      const deadlineDate = new Date(
        data.registrationDeadline
      );

      if (deadlineDate >= eventDate) {
        ctx.addIssue({
          code: "custom",
          path: ["registrationDeadline"],
          message:
            "Registration deadline must be before the event date",
        });
      }
    }
  });