import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Typography } from '@mui/material';
import { Payment } from '@mui/icons-material';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    firstname: '',
    email: '',
    phone: '',
    productinfo: ''
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Check for pending payment when home page loads
    const pendingPayment = JSON.parse(localStorage.getItem('pendingPayment'));
    if (pendingPayment) {
      navigate('/payment', { state: { txnid: pendingPayment.txnid } });
    }
  }, [navigate]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await axios.post(
        "https://wallet-application-iglo.onrender.com/api/payment/pay",
        formData
      );

      if (data.success) {
        sessionStorage.setItem('pendingPayment', JSON.stringify({
          txnid: data.paymentData.txnid,
          timestamp: Date.now()
        }));
        
        const payuForm = document.createElement('form');
        payuForm.method = 'post';
        payuForm.action = data.payu_url;
        payuForm.style.display = 'none';

        Object.entries(data.paymentData).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          payuForm.appendChild(input);
        });

        document.body.appendChild(payuForm);
        payuForm.submit();
      }
    } catch (error) {
      navigate('/payment/failure', {
        state: { error: error.response?.data?.message || "Payment failed" }
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className='min-h-screen bg-slate-100'>
      <NavBar/>
      <Box className="container mx-auto px-4 py-8">
        <Box className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <Typography variant="h4" className="text-center mb-8 text-gray-800">
            Welcome to Your Wallet
          </Typography>
          
          <Box className="flex justify-center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<Payment />}
              onClick={handleOpen}
              sx={{
                padding: '12px 24px',
                fontSize: '1.1rem',
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
                }
              }}
            >
              Make a Payment
            </Button>
          </Box>
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Payment color="primary" />
            <Typography variant="h6">Payment Details</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {["amount", "firstname", "email", "phone", "productinfo"].map((field) => (
              <TextField
                key={field}
                fullWidth
                margin="normal"
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Home