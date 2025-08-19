const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: "wishlists",
  }
);

const Wishlist =
  mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
