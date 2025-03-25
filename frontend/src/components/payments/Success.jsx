import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { CheckCircle, Home } from '@mui/icons-material';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { txnid, amount, message } = location.state || {};

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        <CheckCircle
          sx={{
            fontSize: 80,
            color: 'success.main',
            mb: 2,
          }}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          Payment Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {message || 'Your transaction has been completed successfully.'}
        </Typography>
        {txnid && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Transaction ID: {txnid}
          </Typography>
        )}
        {amount && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Amount: ₹{amount}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Home />}
          onClick={() => navigate('/')}
          sx={{
            mt: 2,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
          }}
        >
          Return to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default Success;