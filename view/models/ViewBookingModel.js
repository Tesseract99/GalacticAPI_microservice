const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId, //referencing is done thru _id
    ref: "ViewTour", //which model to refer during population ?
    required: [true, "Booking must belong to a Tour!"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "ViewUser",
    required: [true, "Booking must belong to a User!"],
  },
  price: { type: Number, require: [true, "Booking must have a price."] },
  createAt: { type: Date, default: Date.now() },
  paid: { type: Boolean, default: true },
});

/*pre query middleware. Runs before fetching docs from DB
Here, used for populating `tour` and `user` fields with their 
references specified in the schema.
*/
bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "tour",
    select: "name", //also fetch the name of the tour
  });
  next();
});

const ViewBooking = mongoose.model("ViewBooking", bookingSchema);

module.exports = ViewBooking;
