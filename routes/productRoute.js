import express from "express";
import {
  createProductController,
  deleteProductPhotoController,
  getAllProductController,
  getSingleProductController,
  productCountController,
  productFilterController,
  productListController,
  productPhotoController,
  searchProductController,
  updateProductController,
  similarProductController,
  productCategoryController,
  braintreeTokenController,
  braintreePaymentController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

//===========Route=======================

//===============create-product=============
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//===============update-product=============
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//===============get-All-product=============
router.get("/get-all-product", getAllProductController);

//===============get-single-product=============
router.get("/get-single-product/:slug", getSingleProductController);

//===============get-product-photo=============
router.get("/product-photo/:pid", productPhotoController);

//===============delete-product=============
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteProductPhotoController
);

//===============Filter-product=============
router.post("/product-filter", productFilterController);

//<========= Pagination(either in client or server-side) in React JS is a function of apps that allows them to show data on a series of pages. =============>

//===============Product-total-count=============
router.get("/product-total-count", productCountController);

//===============Product-per-Page=============
router.get("/product-list/:page", productListController);

//===============Search-product=============
router.get("/search/:keyword", searchProductController);

//===============Similar-product=============
router.get("/related-product/:pid/:cid", similarProductController);

//===============Category wise product =============
router.get("/product-category/:slug", productCategoryController);

//>>>>>>>>>>>>>>>>>>>>>>>>>===================Payment-routes======================

//====================Token=====================
router.get("/braintree/token", braintreeTokenController);

//====================payments=====================
router.post("/braintree/payment", requireSignIn, braintreePaymentController);

export default router;
