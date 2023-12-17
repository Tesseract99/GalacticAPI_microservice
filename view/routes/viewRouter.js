const express = require("express");
const viewsController = require("../controller/viewController");
// const authMiddleware = require("../controller/authMiddleware");
const { authMiddleware } = require("@tour-app-registry/common");
const router = express.Router();
const reviewRouter = require("./reviewRoutes");

// use this middleware for all view related routes
// router.use(authMiddleware.isLoggedIn);

router.use("/:tourId/reviews", reviewRouter);

router.get("/", authMiddleware.isLoggedIn, viewsController.getOverview);
router.get("/tour/:slug", authMiddleware.isLoggedIn, viewsController.getTour);
router.get("/login", authMiddleware.isLoggedIn, viewsController.getLoginForm);
router.get("/signup", viewsController.getSignupForm);
router.get("/me", authMiddleware.protect, viewsController.getAccount);
router.get("/my-tours", authMiddleware.protect, viewsController.getMyTours);
// router.post(
//   "/submit-user-data",
//   authMiddleware.protect,
//   viewsController.updateUserData
// );

module.exports = router;
