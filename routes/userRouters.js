const express = require("express");
const isAutenticated = require("../middleware/isAuth");
const userRouter = express.Router();
const userController = require("../controllers/userctrl");
userRouter.post("/api/v1/users/register", userController.register);
userRouter.post("/api/v1/users/login", userController.login);
userRouter.get(
  "/api/v1/users/profile",
 isAutenticated,
  userController.profile
);
userRouter.put("/api/v1/users/change-password",isAutenticated,userController.changePassword);
userRouter.put("/api/v1/users/update-profile",isAutenticated,userController.updateProfile);

module.exports = userRouter;
