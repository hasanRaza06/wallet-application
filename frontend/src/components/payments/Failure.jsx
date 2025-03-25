import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';

const Failure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const error = searchParams.get('error') || 
                location.state?.error || 
                'Payment processing failed';

  useEffect(() => {
    sessionStorage.removeItem('pendingPayment');
  }, []);

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box sx={{ textAlign: 'center', p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" color="error.main" gutterBottom>
          Payment Failed
        </Typography>
        <Typography variant="h6">{error}</Typography>
        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => navigate('/payment')}
        >
          Try Again
        </Button>
      </Box>
    </Container>
  );
};

export default Failure;