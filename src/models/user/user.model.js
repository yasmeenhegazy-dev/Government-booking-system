import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    enum: ["citizen", "employee", "admin"],
    default: "citizen",
  },
  nationalId: {
    type: String,
    unique: true,
  },
  otp: { String },
  otpExpire: { Date },
  accessToken:{
    type:String
  }
});

export const User = mongoose.model("User", userSchema);
