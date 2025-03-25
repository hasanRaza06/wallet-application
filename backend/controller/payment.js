import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY;
const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT;
const PAYU_URL = process.env.PAYU_URL;

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

    const txnid = "txn_" + Date.now(); // Unique transaction ID
    const hash = generateHash(
      {
        key: PAYU_MERCHANT_KEY,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
      },
      PAYU_MERCHANT_SALT
    );
    

    const paymentData = {
      key: PAYU_MERCHANT_KEY,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      surl: "https://wallet-application-iglo.onrender.com/api/payment/success",
      furl: "https://wallet-application-iglo.onrender.com/api/payment/failure",
      hash,
    };

    res.json({ success: true, paymentData, payu_url: PAYU_URL });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Success Handler
export const paymentSuccess = (req, res) => {
  res.json({
    success: true,
    message: "Payment Successful!",
    data: req.body,
  });
};

// Failure Handler
export const paymentFailure = (req, res) => {
  res.json({
    success: false,
    message: "Payment Failed!",
    data: req.body,
  });
};
