import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    titleNormalized: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    category: {
      type: String,
      enum: [
        "sports",
        "workshop",
        "seminar",
        "competition",
        "cultural",
      ],
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    registrationDeadline: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    registrationFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft",
    },

    registrationsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({
  titleNormalized: 1,
});

eventSchema.index({
  category: 1,
  date: 1,
});

eventSchema.index({
  status: 1,
  date: 1,
});

eventSchema.index({
  date: 1,
});

eventSchema.index({
  createdBy: 1,
  createdAt: -1,
});

const Event = mongoose.model("Event", eventSchema);

export default Event;