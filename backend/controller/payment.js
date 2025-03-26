import dotenv from "dotenv";
import crypto from "crypto";
import axios from "axios";

dotenv.config();

const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY;
const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT;
const PAYU_URL = process.env.PAYU_URL;

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

    // Validate required fields
    const requiredFields = ['amount', 'firstname', 'email', 'phone', 'productinfo'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Generate transaction ID
    const txnid = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Generate hash with proper parameter order
    const hash = generateHash({
      key: PAYU_MERCHANT_KEY,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      // Include empty mandatory parameters in hash generation
      lastname: '',
      address1: '',
      city: '',
      state: '',
      country: '',
      zipcode: '',
      udf1: '',
      udf2: '',
      udf3: '',
      udf4: '',
      udf5: ''
    });

    // Construct payment data with all mandatory parameters
    const paymentData = {
      key: PAYU_MERCHANT_KEY,
      txnid,
      amount: parseFloat(amount).toFixed(2), // Ensure 2 decimal places
      productinfo,
      firstname,
      email,
      phone,
      surl: `http://localhost:5174/payment/success`,
      furl: `http://localhost:5174/payment/failure`,
      hash,
      service_provider: "payu_paisa",
      
      // Mandatory empty parameters
      lastname: '',
      address1: '',
      city: '',
      state: '',
      country: 'India',
      zipcode: '',
      udf1: '',
      udf2: '',
      udf3: '',
      udf4: '',
      udf5: ''
    };

    // Security: Log without sensitive data
    console.log('Payment Initiated:', { 
      txnid: paymentData.txnid,
      amount: paymentData.amount,
      email: paymentData.email.slice(0, 3) + '***' // Partial email
    });

    res.json({
      success: true,
      paymentData,
      payu_url: PAYU_URL
    });

  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Payment initiation failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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