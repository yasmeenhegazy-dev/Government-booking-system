const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    citizenName: {
      type: String,
      required: [true, "Citizen name is required"],
      trim: true,
    },
    citizenEmail: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    citizenPhone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    nationalId: {
      type: String,
      required: [true, "National ID is required"],
      trim: true,
      match: [/^\d{14}$/, "National ID must be exactly 14 digits"],
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed", "verified"],
      default: "confirmed",
    },
    bookingReference: {
      type: String,
      unique: true,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes for query performance and preventing duplicate bookings
appointmentSchema.index({ slotId: 1, nationalId: 1, status: 1 });
appointmentSchema.index({ nationalId: 1, status: 1 });
appointmentSchema.index({ bookingReference: 1 }, { unique: true });

// Generate a unique booking reference before saving
appointmentSchema.pre("save", function (next) {
  if (!this.bookingReference) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingReference = `GOV-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model("Appointment", appointmentSchema);
