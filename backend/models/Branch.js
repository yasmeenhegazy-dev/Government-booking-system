const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Branch name is required"],
      trim: true,
    },
    nameEn: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Branch address is required"],
    },
    addressEn: {
      type: String,
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    cityEn: {
      type: String,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service reference is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

branchSchema.index({ serviceId: 1, isActive: 1 });

module.exports = mongoose.model("Branch", branchSchema);
