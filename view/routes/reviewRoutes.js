const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controller/reviewController");
const { authMiddleware } = require("@tour-app-registry/common");
router
  .get(
    "/",
    authMiddleware.protect,
    reviewController.filterReviewByTourId,
    reviewController.getAllReviews
  )
  .get("/:id", authMiddleware.protect, reviewController.getReview)
  .post(
    "/",
    authMiddleware.protect,
    authMiddleware.restrictTo("user"), //admins, guides shouldn't post reviews
    reviewController.setTourUserIds,
    reviewController.createReview
  )
  .delete(
    "/:id",
    authMiddleware.protect,
    authMiddleware.restrictTo("user", "admin"),
    reviewController.deleteReview
  )
  .patch(
    "/:id",
    authMiddleware.protect,
    authMiddleware.restrictTo("user", "admin"),
    reviewController.updateReview
  );

module.exports = router;
