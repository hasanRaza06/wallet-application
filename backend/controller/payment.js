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
    const hash = generateHash({
      key: PAYU_MERCHANT_KEY,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
    });

    const paymentData = {
      key: PAYU_MERCHANT_KEY,  // Make sure this is included
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      surl: "https://wallet-application-iglo.onrender.com/api/payment/success",
      furl: "https://wallet-application-iglo.onrender.com/api/payment/failure",
      hash,
      service_provider: "payu_paisa",  // Required for PayU
    };

    res.json({ 
      success: true, 
      paymentData, 
      payu_url: PAYU_URL 
    });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const { txnid } = req.body;
    
    // Verify with PayU API or check your database
    // This is a simplified example
    const payment = await PaymentModel.findOne({ txnid });
    
    if (payment && payment.status === 'success') {
      return res.json({
        success: true,
        txnid: payment.txnid,
        amount: payment.amount
      });
    }
    
    return res.json({
      success: false,
      error: 'Payment not found or failed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Verification failed'
    });
  }
};
