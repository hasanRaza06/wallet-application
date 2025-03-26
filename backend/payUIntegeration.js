import express from "express";
import { makePayment, verifyPayment} from "./controller/payment.js";

const router = express.Router();

router.post("/pay", makePayment);       // Route for initiating payment
router.post('/verify-payment', verifyPayment);  // Route for verifying payment

export default router;
