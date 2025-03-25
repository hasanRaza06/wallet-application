import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Get transaction details from URL or state
  const txnid = searchParams.get('txnid') || location.state?.txnid;
  const amount = searchParams.get('amount') || location.state?.amount;

  useEffect(() => {
    if (!txnid) {
      navigate('/');
    }
    // Clear the pending payment from storage
    sessionStorage.removeItem('pendingPayment');
  }, [txnid, navigate]);

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box sx={{ textAlign: 'center', p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" color="success.main" gutterBottom>
          Payment Successful!
        </Typography>
        <Typography variant="h6">Transaction ID: {txnid}</Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>Amount: ₹{amount}</Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 3 }}
          onClick={() => navigate('/')}
        >
          Return Home
        </Button>
      </Box>
    </Container>
  );
};

export default Success;