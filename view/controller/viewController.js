const ViewTour = require("../models/ViewTourModel");
// const User = require("../models/userModel");
// const catchAsync = require("../utils/catchAsync");
// const AppError = require("../utils/appError");
// const Booking = require("../models/bookingModel");
const ViewBooking = require("../models/ViewBookingModel");
const requestCounter = require("../controller/prometheusController");

const {
  AppError,
  handlerFactory,
  catchAsync,
  mailSenderFn,
} = require("@tour-app-registry/common");

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await ViewTour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res
    .setHeader(
      "Content-Security-Policy",
      // "script-src-elem 'self' https://cdnjs.cloudflare.com"
      "default-src *"
    )
    .status(200)
    .render("overview", {
      title: "All Tours",
      tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  // console.log(req.cookies.jwt);
  const tour = await ViewTour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!tour) {
    return next(new AppError("There is no tour with that name.", 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)

  //prometheus
  requestCounter.inc();

  res
    .setHeader(
      "Content-Security-Policy",
      // "script-src-elem 'self' https://cdnjs.cloudflare.com"
      // "default-src *"
      "default-src * style-src 'self' 'unsafe-inline';"
    )
    .status(200)
    .render("tour", {
      title: `${tour.name} Tour`,
      tour,
    });
});

exports.getLoginForm = (req, res) => {
  res
    .setHeader(
      "Content-Security-Policy",
      // "script-src-elem 'self' https://cdnjs.cloudflare.com"
      "default-src *"
    )
    .status(200)
    .render("login", {
      title: "Log into your account",
    });
};

exports.getSignupForm = (req, res) => {
  res
    .setHeader(
      "Content-Security-Policy",
      // "script-src-elem 'self' https://cdnjs.cloudflare.com"
      "default-src *"
    )
    .status(200)
    .render("signup", {
      title: "Sign Up",
    });
};

exports.getAccount = (req, res) => {
  res
    .setHeader(
      "Content-Security-Policy",
      // "script-src-elem 'self' https://cdnjs.cloudflare.com"
      "default-src *"
    )
    .status(200)
    .render("account", {
      title: "Your account",
    });
};

// exports.updateUserData = catchAsync(async (req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   res.status(200).render("account", {
//     title: "Your account",
//     user: updatedUser,
//   });
// });

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings

  const bookings = await ViewBooking.find({ user: req.user._id });
  console.log(bookings);
  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await ViewTour.find({ _id: { $in: tourIDs } });

  res
    .setHeader(
      "Content-Security-Policy",
      // "script-src-elem 'self' https://cdnjs.cloudflare.com"
      "default-src *"
    )
    .status(200)
    .render("overview", {
      title: "My Tours",
      tours,
    });
});
