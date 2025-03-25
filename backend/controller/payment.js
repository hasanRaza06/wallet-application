import dotenv from "dotenv";
import crypto from "crypto";
import axios from "axios";

dotenv.config();

const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY;
const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT;
const PAYU_URL = process.env.PAYU_URL;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || "https://yourfrontend.com";

// Generate PayU Hash
const generateHash = (params) => {
  const hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${PAYU_MERCHANT_SALT}`;
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
      surl: `https://wallet-application-ial8i6198-hasan-razas-projects.vercel.app/payment/success`,
      furl: `https://wallet-application-ial8i6198-hasan-razas-projects.vercel.app/payment/failure`,
      hash,
      service_provider: "payu_paisa",
    };

    // Here you should save the payment to your database first
    // await PaymentModel.create({
    //   txnid,
    //   amount,
    //   status: 'pending',
    //   // other fields
    // });

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

export const verifyPayment = async (req, res) => {
  try {
    const { txnid } = req.body;
    
    // In a real implementation, you would:
    // 1. Check your database first
    // const payment = await PaymentModel.findOne({ txnid });
    
    // 2. If not found in DB or still pending, check with PayU
    const payuResponse = await axios.post('https://test.payu.in/merchant/postservice?form=2', {
      key: PAYU_MERCHANT_KEY,
      command: "verify_payment",
      var1: txnid,
      hash: generateHash({ txnid })
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    // Process PayU's response
    if (payuResponse.data.status === 'success') {
      return res.json({
        success: true,
        txnid,
        amount: payuResponse.data.amount
      });
    }

    return res.json({
      success: false,
      error: 'Payment verification failed'
    });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({
      success: false,
      error: 'Verification failed'
    });
  }
};