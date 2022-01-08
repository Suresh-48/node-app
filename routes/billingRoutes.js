import { Router } from "express";

const router = Router();

import {
  getBilling,
  getAllBilling,
  updateBilling,
  deleteBilling,
  payBillingAsParent,
  payBillingAsStudent,
  createStripePayment,
} from "../controllers/billingController.js";

router.route("/paybill/parent").post(payBillingAsParent);

router.route("/paybill/student").post(payBillingAsStudent);

router.route("/").get(getAllBilling);
router.route("/:id").get(getBilling).patch(updateBilling).delete(deleteBilling);
router.route("/strip/payment").post(createStripePayment);
export default router;
