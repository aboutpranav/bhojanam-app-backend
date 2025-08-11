const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    street: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    zipCode: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    phone: {
      type: Number,
      required: true,
    },
  },

  {
    timestamps: true,
    collection: "addresses",
  }
);

const Address =
  mongoose.models.Address || mongoose.model("Address", addressSchema);

module.exports = Address;
