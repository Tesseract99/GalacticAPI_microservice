const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authController = require("../controller/authController");
const { authMiddleware } = require("@tour-app-registry/common");

router
  .get(
    "/me",
    authMiddleware.protect,
    userController.getMe,
    userController.getUser
  )

  .post("/signup", authController.signup)
  .post("/login", authController.login)
  // .post("/login", common.authController.login)
  .get("/logout", authController.logout)
  .post("/forgotPassword", authController.forgotPassword)
  .patch("/resetPassword/:token", authController.resetPassword)
  .patch(
    "/updatePassword",
    authMiddleware.protect,
    authController.updatePassword
  )
  .patch(
    "/updateMe",
    authMiddleware.protect,
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  )
  .delete(
    "/deleteMe",
    authMiddleware.protect,

    userController.deleteMe
  )
  .get("/:id", authMiddleware.protect, userController.getUser)
  .patch("/:id", authMiddleware.protect, userController.updateUser)
  .delete("/:id", authMiddleware.protect, userController.deleteUser)
  .get(
    "/",
    authMiddleware.protect,
    authMiddleware.restrictTo("admin"),
    userController.getAllUsers
  );

module.exports = router;
