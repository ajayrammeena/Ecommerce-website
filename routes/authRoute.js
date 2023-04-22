import express from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  updateProfileController,
  getOrderController,
  getAllOrderController,
  orderStatusController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
//router object
const router = express.Router();

//routing
//REGISTER ENDPOINT //METHOD=> POST
router.post("/register", registerController);

//LOGIN ENDPOINT /POST
router.post("/login", loginController);

// Forget Password => Post endpoint
router.post("/forget-password", forgotPasswordController);

//protected user route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//<========User update profile===============>
router.put("/profile", requireSignIn, updateProfileController);

//<========Get-user-orders===============>
router.get("/orders", requireSignIn, getOrderController);

//<========Get-user-orders===============>
router.get("/all-orders", requireSignIn, isAdmin, getAllOrderController);

//<========Get-user-orders===============>
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);
export default router;
