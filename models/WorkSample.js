
const mongoose = require("mongoose");

const workSampleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    images: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
      validate: {
        validator: function (images) {
          return images.length <= 3;
        },
        message: "Bitta ish namunasiga ko'pi bilan 3 ta rasm qo'shish mumkin.",
      },
    },

    usta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const WorkSample = mongoose.model(
  "WorkSample",
  workSampleSchema
);

module.exports = WorkSample;
