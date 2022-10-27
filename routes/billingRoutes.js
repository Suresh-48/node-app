import { Router } from "express";
import { verifyToken } from "../utils/tokenAuth.js";

const router = Router();

import {
  getBilling,
  getAllBilling,
  updateBilling,
  deleteBilling,
  payBillingAsParent,
  payBillingAsStudent,
  createStripePayment,
  parentCheckoutLesson,
  studentCheckoutLesson,
  createStripePaymentForLesson,
} from "../controllers/billingController.js";

router.route("/paybill/parent").post( payBillingAsParent);

router.route("/paybill/student").post( payBillingAsStudent);

router.route("/checkout/lesson/parent").post( parentCheckoutLesson);

router.route("/checkout/lesson/student").post( studentCheckoutLesson);

router.route("/").get(verifyToken, getAllBilling);
router
  .route("/:id")
  .get(verifyToken, getBilling)
  .patch(verifyToken, updateBilling)
  .delete(verifyToken, deleteBilling);
router.route("/strip/payment").post( createStripePayment);
router.route("/lesson/strip/payment").post(createStripePaymentForLesson);
export default router;
