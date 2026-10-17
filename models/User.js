
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profession: {
      type: String,
      required: true,
      trim: true,
    },

    // Profil rasmi uchun URL
    profileImage: {
      type: String,
      default: "",
      trim: true,
    },

    role: {
      type: String,
      enum: ["usta", "admin"],
      default: "usta",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
