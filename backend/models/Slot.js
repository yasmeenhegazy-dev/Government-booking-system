const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: [true, "Branch reference is required"],
    },
    date: {
      type: Date,
      required: [true, "Slot date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
    },
    capacity: {
      type: Number,
      default: 1,
      min: 1,
    },
    bookedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes for query performance
slotSchema.index({ branchId: 1, date: 1, isActive: 1 });

// Virtual field: check if slot is available
slotSchema.virtual("isAvailable").get(function () {
  return this.bookedCount < this.capacity;
});

// Include virtuals in JSON output
slotSchema.set("toJSON", { virtuals: true });
slotSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Slot", slotSchema);
