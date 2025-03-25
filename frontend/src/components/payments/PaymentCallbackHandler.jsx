import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentCallbackHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const txnid = searchParams.get('txnid');
        const status = searchParams.get('status');
        const hash = searchParams.get('hash');
        const amount = searchParams.get('amount');
        const error = searchParams.get('error_Message');

        console.log('Payment Callback Data:', {
          txnid,
          status,
          hash,
          amount,
          error
        });

        if (!txnid) {
          window.location.hash = '#/payment/failure';
          return;
        }

        if (status === 'success') {
          try {
            // Verify the payment with your backend
            const response = await axios.post(
              'https://wallet-application-iglo.onrender.com/api/payment/verify',
              { txnid }
            );

            if (response.data.success) {
              // Clear the pending payment from storage
              localStorage.removeItem('pendingPayment');
              window.location.hash = '#/payment/success';
            } else {
              window.location.hash = '#/payment/failure';
            }
          } catch (verifyError) {
            console.error('Verification error:', verifyError);
            window.location.hash = '#/payment/failure';
          }
        } else {
          window.location.hash = '#/payment/failure';
        }
      } catch (error) {
        console.error('Payment callback error:', error);
        window.location.hash = '#/payment/failure';
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Verifying your payment...</p>
      </div>
    </div>
  );
};

export default PaymentCallbackHandler;