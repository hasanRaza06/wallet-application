import express from "express";
import { makePayment, paymentSuccess, paymentFailure } from "./controller/payment.js";

const router = express.Router();

router.post("/pay", makePayment);       // Route for initiating payment
router.post("/success", paymentSuccess); // Route for successful payment
router.post("/failure", paymentFailure); // Route for failed payment

export default router;
