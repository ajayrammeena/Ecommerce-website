import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoryController,
  getSingleCategoryController,
  updateCategoryController,
} from "./../controllers/categoryController.js";

const router = express.Router();

//============Routes==================

//========Create-routes===================
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//========Update-route===================
//In Mongoose, each document (i.e., instance) of a model has a unique _id field, which is an automatically generated identifier
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//========Get-all-category-route===================
router.get("/get-all-category", getAllCategoryController);

//========Get-single-category===================
// (Using a slug field for category URLs can make them more user-friendly and SEO-friendly than using the _id field. A slug is easier to remember
// and can include relevant keywords, making it more descriptive and relevant to search engines.This can be particularly useful if you want to share
// the category URL with others or display it in a user interface.)

router.get("/get-single-category/:slug", getSingleCategoryController);

//========Delete-category-route===================
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;
