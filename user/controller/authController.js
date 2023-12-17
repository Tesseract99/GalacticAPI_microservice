const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
const UserCreatedPublisher = require("../events/publisher/user-created-publisher.js");
const {
  AppError,
  handlerFactory,
  catchAsync,
  mailSenderFn,
} = require("@tour-app-registry/common");
const { natsWrapper } = require("@tour-app-registry/common");

const createJwtToken = (_id, name, email, role, jwtExpiry) => {
  const token = jwt.sign(
    { _id, name, email, role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: jwtExpiry || process.env.JWT_EXPIRES_IN,
    }
  );
  return token;
};

const sendJwtToken = (statusCode, user, res, jwtExpiry) => {
  // const token = createJwtToken(user._id, user.name, user.email, user.role);
  const token = createJwtToken(
    user._id,
    user.name,
    user.email,
    user.role,
    jwtExpiry
  );
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  user.password = undefined;

  cookieOptions.secure = process.env.NODE_ENV === "production"; //make it secure only in production
  res.locals.user = user;
  res
    .status(statusCode)
    .cookie("jwt", token, cookieOptions)
    .json({
      status: "success",
      data: {
        user: user,
      },
      token,
    });
};
exports.sendJwtToken = sendJwtToken;
exports.signup = catchAsync(async (req, res, next) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    photo: req.body.photo,
    role: req.body.role,
  };
  // console.log(`[signup] ${userData.name}`);
  const newUser = await User.create(userData);
  const newuserEventData = {
    name: newUser.name,
    email: newUser.email,
    active: newUser.active,
    role: newUser.role,
  };

  // try {
  //   const stan = natsWrapper.client;
  //   const publisher = new UserCreatedPublisher(stan);
  //   publisher.publish(newuserEventData);
  // } catch (error) {
  //   console.log(`Publishing error, ${error}`);
  // }

  const stan = natsWrapper.client;
  const publisher = new UserCreatedPublisher(stan);
  publisher.publish(newuserEventData); //publisher.publish returns a Promise

  // const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET_KEY, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });
  // const token = createJwtToken(newUser._id);
  // res.status(201).json({
  //   status: "success",
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
  sendJwtToken(201, newUser, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(`[login] ${email}`);
  //check if email and password have been provided
  if (!email || !password) {
    return next(new AppError("please provide email and password", 401));
  }

  //check if the email exists in the DB and password is correct
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  sendJwtToken(200, user, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  // console.log("logout controller");
  res
    .status(200)
    .cookie("jwt", "loggedoutval", {
      expiresIn: new Date(Date.now() + 10 * 1000),
    })
    .json({
      status: "success",
    });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //check if the email exists
  const user = await User.findOne({ email: req.body.email });

  //if not, send error
  if (!user) {
    return next(new AppError("The User does not exist", 404));
  }

  //get the reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send it to user's email
  mailSenderFn({
    senderName: "Natours",
    senderEmail: "Natours@ResetPassword.com",
    receiverMailList: [`${user.email}`],
    subject: `Bhaiyon Aur Bheno. Ye lo ${resetToken}`,
    body: `Gym Body`,
  });
  //send response
  res.status(200).json({
    status: "success",
    data: resetToken,
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //convert reset token to hash

  const UserResetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log(req.params.token, UserResetToken);
  //query DB for user with this token which has not expired
  const user = await User.findOne({
    passwordResetToken: UserResetToken,
    passwordResetExpiry: { $gt: Date.now() },
  });
  //if user is not there, send error
  if (!user)
    return next(new AppError("Invalid Token or Token has expired", 404));
  //if user is there, reset password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;
  await user.save();

  //send JWT token back as response
  // const newJwtToken = createJwtToken(user._id);
  // res.status(200).json({
  //   status: "Success",
  //   token: newJwtToken,
  // });
  sendJwtToken(200, user, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //get the user from DB
  const user = await User.findOne({ email: req.user.email }).select(
    "+password"
  );
  //const user = await User.findOne({ email }).select("+password");
  //verify current password
  if (
    !user ||
    !(await user.verifyPassword(req.body.currentPassword, user.password))
  ) {
    return next(new AppError("Invalid email or password", 401));
  }

  //update the password
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.newConfirmPassword;
  await user.save();
  //send JWT token as response
  // const newJwtToken = createJwtToken(user._id);
  // res.status(200).json({
  //   status: "Success",
  //   token: newJwtToken,
  // });
  sendJwtToken(200, user, res);
});
