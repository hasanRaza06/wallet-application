import {payUClient,payU_key,payU_salt} from "../payU.config.js";
import crypto from "crypto";


export const makePayment = async (req, res) => {
    try {
        const txn_id = 'PAYU_MONEY_' + Math.floor(Math.random() * 8888888);
        const { amount, product, firstname, email, mobile } = req.body;

        const udf1 = '';
        // ... other udf fields as needed

        const hashString = `${payU_key}|${txn_id}|${amount}|${JSON.stringify(product)}|${firstname}|${email}|${udf1}||||||||||${payU_salt}`;
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');

        const paymentData = {
            key: payU_key,
            txnid: txn_id,
            amount: amount,
            productinfo: JSON.stringify(product),
            firstname: firstname,
            email: email,
            phone: mobile,
            surl: `https://wallet-application-srk1.onrender.com/api/payments/verify`,
            furl: `https://wallet-application-srk1.onrender.com/api/payments/verify`,
            hash: hash,
            service_provider: 'payu_paisa',
            currency: 'INR',
            isAmountFilledByCustomer: 'false'
        };

        const payu_url = 'https://test.payu.in/_payment'; // PayU test endpoint

        res.status(200).json({
            success: true,
            paymentData: paymentData,
            payu_url: payu_url
        });
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
};

// Add to your backend
export const handlePayUCallback = async (req, res) => {
    try {
      // 1. Extract parameters
      const { mihpayid, status, hash, txnid } = req.query;
  
      // 2. Validate hash (MANDATORY)
      const hashString = `${payU_salt}|${status}|||||||||||${req.query.email}|${req.query.firstname}|${req.query.productinfo}|${req.query.amount}|${txnid}${payU_key}`;
      const generatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
  
      // 3. Security check
      if (generatedHash !== hash) {
        return res.redirect('https://wallet-application-sand.vercel.app/#/payment/failure?reason=invalid_hash');
      }
  
      // 4. Successful payment handling
      res.redirect(`https://wallet-application-sand.vercel.app/#/payment/success?txnid=${mihpayid}`);
      
    } catch (error) {
      res.redirect('https://wallet-application-sand.vercel.app/#/payment/failure');
    }
  };

// Add to your backend code
export const verifyPayment = async (req, res) => {
    try {
        const { mihpayid, status, hash } = req.query;
        
        // Verify the hash (critical for security)
        const hashString = `${payU_salt}|${status}|||||||||||${req.query.email}|${req.query.firstname}|${req.query.productinfo}|${req.query.amount}|${req.query.txnid}${payU_key}`;
        const generatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

        if (generatedHash !== hash) {
            return res.status(400).json({ success: false, message: 'Invalid transaction' });
        }

        // Successful verification
        res.redirect(`https://wallet-application-sand.vercel.app/#/payment/success?txnid=${mihpayid}`);
        
    } catch (error) {
        res.redirect(`https://wallet-application-sand.vercel.app/#/payment/failure`);
    }
};

// export const verifyPayment=async(req,res)=>{
//     try {
//           // res.send("Done")


//           const verified_Data = await payUClient.verifyPayment(req.params.txnid);
//           const data = verified_Data.transaction_details[req.params.txnid]

//         //   res.redirect(`http://localhost:5174/payment/${data.status}/${data.txnid}`)

//           if (data.status == 'success') {
//              return res.status(200).json({
//                 success: true,
//                 message: 'Payment is successful',
//              })
//             }else{
//                 return res.status(400).json({
//                     success: false,
//                     message: "Payment failed"
//                     })
//             }
  
//           //res.redirect(`http://localhost:5173/success/${data.txnid}`)
//           // res.send({
//           //     status:data.status,
//           //     amt:data.amt,
//           //     txnid:data.txnid,
//           //     method:data.mode,
//           //     error:data.error_Message,
//           //     created_at:new Date(data.addedon).toLocaleString()
//           // })
//   // PAYU_MONEY_4996538
//     } catch (error) {
//         return res.status(400).send({ success:false,msg: error.message });
//     }
// }


