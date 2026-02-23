// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },

  weight: Number, // kg (important)

  steps: {
    type: Number,
    default: 0
  },

  caloriesBurned: {
    type: Number,
    default: 0
  },

  nutrition: {
    protein: Number,
    carbs: Number,
    fat: Number
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
