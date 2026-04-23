import mongoose from "mongoose";

export function connectDB() {
  mongoose.connect("mongodb://localhost:27017/Government-booking-system")
    .then(() => {
      console.log("Database connected succefully");
    })
    .catch((err) => {
      console.log(err);
    });
}


