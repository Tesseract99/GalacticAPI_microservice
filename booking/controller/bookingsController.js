const Razorpay = require("razorpay");
// const ViewTour = require("../models/tourModel");
// const User = require("../models/userModel");
// const catchAsync = require("../utils/catchAsync");
const ViewTour = require("../models/ViewTourModel");
const razorpayUtils = require("razorpay/dist/utils/razorpay-utils");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Booking = require("../models/bookingModel");
const {
  AppError,
  handlerFactory,
  catchAsync,
  mailSenderFn,
} = require("@tour-app-registry/common");
const BookingCreatedPublisher = require("../events/publisher/booking-created-publisher");
const { natsWrapper } = require("@tour-app-registry/common");

const createJwtToken = (_id) => {
  const token = jwt.sign({ _id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

const sendJwtToken = (statusCode, tour, order, res) => {
  const token = createJwtToken(tour._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 5 * 60 * 1000), //5mins
    httpOnly: true,
  };

  cookieOptions.secure = process.env.NODE_ENV === "production"; //make it secure only in production
  res.locals.tour = tour;
  res.status(statusCode).cookie("tour_jwt", token, cookieOptions).json({
    status: "success",
    order,
  });
};

const instance = new Razorpay({
  key_id: process.env.RZPAY_KEYID,
  key_secret: process.env.RZPAY_KEYSECRET,
});

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await ViewTour.findById(req.params.tourId);

  const options = {
    amount: tour.price * 100, // amount in the smallest currency unit (amount X 100)
    currency: "INR",
  };

  const order = await instance.orders.create(options);
  sendJwtToken(200, tour, order, res);
  // res.status(200).json({
  //   status: "success",
  //   order,
  // });
});

const publisher = async (booking) => {
  const stan = natsWrapper.client;
  await new BookingCreatedPublisher(stan).publish(booking);
};

exports.paymentSuccess = async (req, res, next) => {
  const result = await razorpayUtils.validatePaymentVerification(
    {
      order_id: req.body.razorpay_order_id,
      payment_id: req.body.razorpay_payment_id,
    },
    req.body.razorpay_signature,

    process.env.RZPAY_KEYSECRET
  );

  if (result && req.cookies.tour_jwt) {
    const token = req.cookies.tour_jwt;
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY
    );

    const bookedTour = await ViewTour.findOne({ _id: decoded._id });
    const tourId = decoded._id;
    const userId = req.user._id.toString();
    const { price } = bookedTour;
    console.log(tourId, userId, price);
    // console.log(req.user._id.toString(), bookedTour._id.toString());
    await Booking.create({ tour: tourId, user: userId, price });

    publisher({ tour: tourId, user: userId, price });

    res.status(200).json({
      status: "success",
      message: "Thank You For Touring with us!",
    });
  } else {
    res.status(402).json({
      status: "fail",
      message: "Payment Failed. Please try again",
    });
  }
};
