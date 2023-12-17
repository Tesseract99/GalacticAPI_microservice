const UserUpdatedPublisher = require("../events/publisher/user-updated-publisher");
const fs = require("fs");
const User = require("../models/userModel");
// const AppError = require("../utils/appError");
// const catchAsync = require("../utils/catchAsync");
// const handlerFactory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");
const {
  AppError,
  handlerFactory,
  catchAsync,
} = require("@tour-app-registry/common");
const { natsWrapper } = require("@tour-app-registry/common");
const { sendJwtToken } = require("./authController");

const filterObj = (obj, keyFilter) => {
  const filteredObj = {};

  for (const key of Object.keys(obj)) {
    if (keyFilter.includes(key)) {
      filteredObj[key] = obj[key];
    }
  }

  return filteredObj;
};

exports.getAllUsers = handlerFactory.getAll(User);

exports.getUser = handlerFactory.getOne(User);

//Not for updating Passwords
exports.updateUser = handlerFactory.updateOne(User);

exports.deleteUser = handlerFactory.deleteOne(User);

/*
###################  MULTER IMAGE UPLOAD AND RESIZING  ##################
*/

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

//RE-SIZING the photo
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

/*
##################################################################################
*

/* Individual User Operations */

const calculateJWTExpiry = (user) => {
  const iat = user.iat;
  const exp = user.exp;
  const currentTime = Math.floor(Date.now() / 1000);
  const remainingTime = exp - currentTime;
  const remainingDays = remainingTime / (24 * 60 * 60);
  return Math.floor(remainingDays);
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //if the body has password, confirmPassword - throw error
  const updatedInfo = req.body;
  if ("password" in updatedInfo || "confirmPassword" in updatedInfo) {
    return next(new AppError("Cannot update password in this endpoint", 405));
  }

  //extract only name and email from the body
  const filteredUpdatedInfo = filterObj(updatedInfo, ["name", "email"]);
  if (req.file) filteredUpdatedInfo.photo = req.file.filename;
  //find by id and update only the name and email
  const origUser = await User.findById(req.user._id);
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    filteredUpdatedInfo,
    {
      new: true,
    }
  );

  const { name, email, active, role } = updatedUser;

  //publish event
  const stan = natsWrapper.client;
  const publisher = new UserUpdatedPublisher(stan);
  publisher.publish({ name, email, active, role, origEmail: origUser.email });

  //send updated user as response
  updatedUser.password = undefined;
  // res.locals.user = updatedUser;
  const jwtExpiry = calculateJWTExpiry(req.user) + "d";
  sendJwtToken(200, updatedUser, res, jwtExpiry);

  // res.status(200).json({
  //   status: "success",
  //   user: updatedUser,
  // });
});

/*
we dont actually delete the user. we just set the 'active'
property to false.
*/
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user;
  next();
});
