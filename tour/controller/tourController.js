const fs = require("fs");
const Tour = require("../models/tourModel");
// const APIFeatures = require("../utils/apiFeatures");//
// const AppError = require("../utils/appError");
// const catchAsync = require("../utils/catchAsync");
// const handlerFactory = require("./handlerFactory")

const {
  AppError,
  handlerFactory,
  catchAsync,
  APIFeatures,
} = require("@tour-app-registry/common");
const { escape } = require("querystring");
const TourCreatedPublisher = require("../events/publisher/tour-created-publisher.js");
const { natsWrapper } = require("@tour-app-registry/common");

//event publisher
const publisher = async (tour) => {
  const stan = natsWrapper.client;
  await new TourCreatedPublisher(stan).publish(tour);
};

//middleware
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage";
  next();
};

//controllers

exports.getAllTours = handlerFactory.getAll(Tour);

exports.getTour = handlerFactory.getOne(Tour, {
  path: "reviews",
  select: "-tour -__v -id",
});

exports.createTour = handlerFactory.createOne(Tour, publisher);

exports.updateTour = handlerFactory.updateOne(Tour);

exports.deleteTour = handlerFactory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: "$difficulty", //what I want to group by. null- no grouping ?
        num: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 }, //1 for ascending
    },
  ]);
  res.status(200).json({
    status: "success",
    message: stats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = Number(req.params.year);
  const plan = await Tour.aggregate([
    { $unwind: "$startDates" },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStart: { $sum: 1 },
        tours: {
          $push: {
            name: "$name",
            price: "$price",
            startDates: "$startDates",
          },
        },
      },
    },
    { $addFields: { month: "$_id" } },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    message: plan,
  });
});
