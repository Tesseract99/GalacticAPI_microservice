const mongoose = require("mongoose");
const slugify = require("slugify");
const ViewUser = require("./ViewUserModel");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "Name is too long"],
      minlength: [10, "Name is too short"],
    },

    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a max group size"],
    },
    difficulty: {
      type: String,
      required: [true],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "difficulty must be one of easy/medium/difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 0"],
      max: [5, "Rating is out of 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true, //removes all white spaces at the beginning and the end
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: {
      type: [Date],
    },
    isSecret: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      default: this.name,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      //this has to be an array -- embedding locations in tours
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ViewUser", // it specifies the referenced model
      },
    ],
  },
  { toJSON: { virtuals: true } }
);

//durationWeeks: virtual property
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//indexes (sorting while storing in DB) - improves read performance
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

//slug: pre middleware
tourSchema.pre("save", function (next) {
  //create the slug
  this.slug = slugify(this.name, { lower: true });
  next();
});

//isSecret filter: pre middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ isSecret: { $ne: true } });
  next();
});

//isSecret filter:  for aggregation
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isSecret: { $ne: true } } });
  next();
});

//middleware that attaches the populate function to the query
//this populates the reference to the guides
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v",
  });
  next();
});

//virtual field reviews, Parent Referencing already exists : Review -> Tour
tourSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "tour",
});

const ViewTour = mongoose.model("ViewTour", tourSchema);

module.exports = ViewTour;
