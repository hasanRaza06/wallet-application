import React, { useState } from 'react';
import { 
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Grid
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    product: '',
    firstname: '',
    email: '',
    mobile: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (!formData.product) newErrors.product = 'Product info is required';
    if (!formData.firstname) newErrors.firstname = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Invalid mobile number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
        const response = await axios.post('http://localhost:3000/payment', formData);
        
        if (!response.data?.paymentData || !response.data?.payu_url) {
            throw new Error('Invalid response from payment gateway');
        }

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = response.data.payu_url;
        form.style.display = 'none';

        // Add all paymentData fields to the form
        Object.entries(response.data.paymentData).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();

    } catch (error) {
        // Handle error
    } finally {
        setLoading(false);
    }
};

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Payment Gateway
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                error={!!errors.amount}
                helperText={errors.amount}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                name="product"
                value={formData.product}
                onChange={handleChange}
                error={!!errors.product}
                helperText={errors.product}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                error={!!errors.firstname}
                helperText={errors.firstname}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                error={!!errors.mobile}
                helperText={errors.mobile}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                size="large"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Proceed to Pay'
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentPage;