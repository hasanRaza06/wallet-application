import pauU from "payu-websdk";


export const payU_key=process.env.MERCHANT_KEY;
export const payU_salt=process.env.MERCHANT_SALT;

// create client 

export const payUClient=new pauU({
   key:payU_key,
   salt:payU_salt
},process.env.PAYU_ENVIRONMENT)