const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A review must have a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "A review must have a description"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ViewTour",
      required: [true, "review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ViewUser",
      required: [true, "review must belong to a user"],
    },
  },
  { toJSON: { virtuals: true } }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate([
    { path: "tour", select: "name" },
    { path: "user", select: "name photo" },
  ]);
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
