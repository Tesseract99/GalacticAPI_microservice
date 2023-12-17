const express = require("express");

const router = express.Router();
const tourController = require("../controller/tourController");
// const authMiddleware = require("../controller/authMiddleware");
// const reviewRouter = require("./reviewRoutes");
const { authMiddleware } = require("@tour-app-registry/common");

/*router.use("/:tourId/reviews", reviewRouter);*/

router
  .get("/", tourController.getAllTours)
  .get("/top-5-cheap", tourController.aliasTopTours, tourController.getAllTours)
  .get(
    "/tour-stats",
    authMiddleware.protect,
    authMiddleware.restrictTo("admin", "lead-guide", "guide"),
    tourController.getTourStats
  )
  .get(
    "/monthly-plan/:year",
    authMiddleware.protect,
    authMiddleware.restrictTo("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan
  )
  .get("/:id", tourController.getTour)
  .post(
    "/",
    authMiddleware.protect,
    authMiddleware.restrictTo("admin", "lead-guide"),
    tourController.createTour
  )
  .patch(
    "/:id",
    authMiddleware.protect,
    authMiddleware.restrictTo("admin", "lead-guide"),
    tourController.updateTour
  )
  .delete(
    "/:id",
    authMiddleware.protect,
    authMiddleware.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
