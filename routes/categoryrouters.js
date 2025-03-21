const express = require("express");
const isAutenticated = require("../middleware/isAuth");
const categoryRouter = express.Router();
const categoryController = require("../controllers/categoryctrl");
categoryRouter.post("/api/v1/category/create",isAutenticated, categoryController.createCategory);
categoryRouter.post("/api/v1/category/lists",isAutenticated, categoryController.listCategories);
categoryRouter.put("/api/v1/category/update",isAutenticated, categoryController.update);
categoryRouter.delete("/api/v1/category/delete",isAutenticated, categoryController.delete);


module.exports = categoryRouter;
