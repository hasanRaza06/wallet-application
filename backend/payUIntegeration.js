import express from "express";
import { makePayment, verifyPayment, paymentWebhook } from "./controller/payment.js";

const router = express.Router();

router.post("/pay", makePayment);       // Route for initiating payment
router.post('/verify', verifyPayment);  // Route for verifying payment
router.post('/webhook', paymentWebhook); // Route for PayU webhook

export default router;
