import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Box, CircularProgress, Typography } from '@mui/material';

const PaymentCallbackHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const verifyPayment = async (txnid) => {
    try {
      const { data } = await axios.post(
        'https://wallet-application-iglo.onrender.com/api/payment/verify',
        { txnid }
      );
      return data;
    } catch (error) {
      console.error('Verification error:', error);
      return { success: false, error: 'Verification failed' };
    }
  };

  useEffect(() => {
    const processPayment = async () => {
      const txnid = searchParams.get('txnid');
      const status = searchParams.get('status');
      const error = searchParams.get('error');

      if (!txnid) {
        navigate('/payment/failure', {
          state: { error: 'Transaction ID missing' }
        });
        return;
      }

      if (status === 'success') {
        const verification = await verifyPayment(txnid);
        if (verification.success) {
          navigate('/payment/success', {
            state: {
              txnid: verification.txnid,
              amount: verification.amount,
              verified: true
            }
          });
        } else {
          navigate('/payment/failure', {
            state: { error: verification.error || 'Payment not confirmed' }
          });
        }
      } else {
        navigate('/payment/failure', {
          state: { error: error || 'Payment rejected by PayU' }
        });
      }
    };

    processPayment();
  }, [navigate, searchParams]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh'
    }}>
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 3 }}>
        Verifying payment...
      </Typography>
    </Box>
  );
};

export default PaymentCallbackHandler;