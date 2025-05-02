import payU from "payu-websdk";
import dotenv from 'dotenv'
dotenv.config();

export const payU_key = process.env.MERCHANT_KEY;
export const payU_salt = process.env.MERCHANT_SALT;

// // Debugging: Check if values are loaded
// console.log('PayU Key:', payU_key); // Should show your key
// console.log('PayU Salt:', payU_salt); // Should show your salt

export const payUClient = new payU(
  {
    key: payU_key,
    salt: payU_salt,
  },
  process.env.PAYU_ENVIRONMENT // Ensure this is "TEST" or "PROD"
);