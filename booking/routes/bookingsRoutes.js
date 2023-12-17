const express = require("express");
const router = express.Router({ mergeParams: true });
// const reviewController = require("../controller/reviewController");
// const authController = require("../controller/authController");
const { authMiddleware } = require("@tour-app-registry/common");
const bookingController = require("../controller/bookingsController");

router.use(authMiddleware.protect);

router
  .get(
    "/checkout-session/:tourId",
    authMiddleware.protect,
    bookingController.createCheckoutSession
  )
  .post(
    "/payment-success/",
    authMiddleware.protect,
    bookingController.paymentSuccess
  );

module.exports = router;
