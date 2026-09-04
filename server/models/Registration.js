import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["not_required", "unpaid", "paid", "refunded"],
      default: "not_required",
    },

    paymentReference: {
      type: String,
      trim: true,
      default: null,
    },

    paymentSubmittedAt: {
      type: Date,
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

registrationSchema.index(
  {
    user: 1,
    event: 1,
  },
  {
    unique: true,
  }
);

registrationSchema.index({
  user: 1,
  status: 1,
  createdAt: -1,
});

registrationSchema.index({
  event: 1,
  status: 1,
  createdAt: -1,
});

const Registration = mongoose.model(
  "Registration",
  registrationSchema
);

export default Registration;