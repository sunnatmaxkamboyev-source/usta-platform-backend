const mongoose = require("mongoose");

const vacancySchema = new mongoose.Schema(
  {
    // ========================================
    // VAKANSIYA MA'LUMOTLARI
    // ========================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: String,
      default: "Kelishiladi",
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },




    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },

    telegram: {
      type: String,
      required: true,
      trim: true,
    },




    usta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


  

    status: {
      type: String,
      enum: [
        "active",
        "inactive",
        "deleted",
      ],
      default: "active",
    },




    views: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);




const Vacancy = mongoose.model(
  "Vacancy",
  vacancySchema
);

module.exports = Vacancy;