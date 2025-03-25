import dotenv from "dotenv";
import crypto from "crypto";
import axios from "axios";

dotenv.config();

const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY;
const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT;
const PAYU_URL = process.env.PAYU_URL;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://wallet-application-ial8i6198-hasan-razas-projects.vercel.app";

// Generate PayU Hash
const generateHash = (params) => {
  const hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${PAYU_MERCHANT_SALT}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
};

// Generate verification hash
const generateVerificationHash = (txnid) => {
  const hashString = `${PAYU_MERCHANT_KEY}|verify_payment|${txnid}|${PAYU_MERCHANT_SALT}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
};

// Payment Handler
export const makePayment = async (req, res) => {
  try {
    const { amount, firstname, email, phone, productinfo } = req.body;

    if (!amount || !firstname || !email || !phone || !productinfo) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const txnid = "TXN" + Date.now(); // Better transaction ID format
    const hash = generateHash({
      key: PAYU_MERCHANT_KEY,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
    });

    const paymentData = {
      key: PAYU_MERCHANT_KEY,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      surl: `${FRONTEND_URL}/payment/callback`,
      furl: `${FRONTEND_URL}/payment/callback`,
      hash,
      service_provider: "payu_paisa",
    };

    console.log('Payment Data:', {
      ...paymentData,
      surl: paymentData.surl,
      furl: paymentData.furl
    });

    res.json({ 
      success: true, 
      paymentData, 
      payu_url: PAYU_URL 
    });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ success: false, message: "Payment initiation failed" });
  }
};

// PayU will call this webhook (configure in PayU dashboard)
export const paymentWebhook = async (req, res) => {
  try {
    const { txnid, status, hash } = req.body;
    
    // Verify the hash from PayU
    const expectedHash = generateHash({
      key: PAYU_MERCHANT_KEY,
      txnid,
      amount: req.body.amount,
      productinfo: req.body.productinfo,
      firstname: req.body.firstname,
      email: req.body.email,
    });

    if (hash !== expectedHash) {
      return res.status(400).send("Invalid hash");
    }

    // Update payment status in your database
    // await PaymentModel.findOneAndUpdate(
    //   { txnid },
    //   { status: status === 'success' ? 'success' : 'failed' }
    // );

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send("Webhook processing failed");
  }
};

// Payment verification endpoint
export const verifyPayment = async (req, res) => {
  try {
    const { txnid } = req.body;
    
    if (!txnid) {
      return res.status(400).json({
        success: false,
        error: 'Transaction ID is required'
      });
    }

    const hash = generateVerificationHash(txnid);
    
    const verificationResponse = await axios.post('https://info.payu.in/merchant/postservice', {
      key: PAYU_MERCHANT_KEY,
      command: 'verify_payment',
      var1: txnid,
      hash
    });

    if (verificationResponse.data.status === 'success') {
      return res.json({
        success: true,
        txnid: verificationResponse.data.txnid,
        amount: verificationResponse.data.amount
      });
    }

    return res.json({ 
      success: false,
      error: verificationResponse.data.message || 'Payment verification failed'
    });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({
      success: false,
      error: 'Verification error'
    });
  }
};