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

        if (!txnid || !status || !hash) {
          navigate('/payment/failure');
          return;
        }

        // Verify the payment with your backend
        const response = await axios.post(
          'https://wallet-application-iglo.onrender.com/api/payment/verify',
          { txnid }
        );

        if (response.data.success) {
          // Clear the pending payment from storage
          sessionStorage.removeItem('pendingPayment');
          navigate('/payment/success');
        } else {
          navigate('/payment/failure');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        navigate('/payment/failure');
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

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