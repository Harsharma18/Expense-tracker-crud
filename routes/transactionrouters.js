const express = require("express");
const transactionRouter = express.Router();
const transactionController = require("../controllers/transactionctrl");
const isAutenticated = require("../middleware/isAuth");
//?create
transactionRouter.post(
  "/api/v1/transaction/create",
  isAutenticated,
  transactionController.create,
);
//!lists
transactionRouter.get(
  "/api/v1/transaction/lists",
  isAutenticated,
  transactionController.getlist,
);
//*update
transactionRouter.put(
    "/api/v1/transaction/update/:id",
    isAutenticated,
    transactionController.update,
  );
  //!delete
  transactionRouter.delete(
    "/api/v1/transaction/delete/:id",
    isAutenticated,
    transactionController.delete,
  );
module.exports = transactionRouter;
