const Review = require("../models/reviewModel");
const { handlerFactory } = require("@tour-app-registry/common");

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user;

  next();
};

//middleware for reviews on tour route
exports.filterReviewByTourId = (req, res, next) => {
  let filter = {};
  if (req.params.tourId)
    filter = {
      tour: {
        _id: req.params.tourId,
      },
    };
  req.initialFilter = filter;
  next();
};

exports.createReview = handlerFactory.createOne(Review);
exports.getAllReviews = handlerFactory.getAll(Review);
exports.getReview = handlerFactory.getOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
exports.deleteReview = handlerFactory.deleteOne(Review);
