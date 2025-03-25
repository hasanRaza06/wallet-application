import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { Payment } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    amount: "",
    firstname: "",
    email: "",
    phone: "",
    productinfo: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for payment verification state on component mount
  useEffect(() => {
    const verifyFromState = async () => {
      if (location.state?.txnid) {
        setLoading(true);
        try {
          const response = await axios.post(
            "https://wallet-application-iglo.onrender.com/api/payment/verify",
            { txnid: location.state.txnid }
          );
          
          if (!response.data.success) {
            navigate('/payment/failure', {
              state: { error: 'Payment verification failed' }
            });
          }
        } catch (error) {
          navigate('/payment/failure', {
            state: { error: 'Verification error' }
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    verifyFromState();
  }, [location.state, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        // Store payment data in localStorage (persists across tabs)
        localStorage.setItem('pendingPayment', JSON.stringify({
          txnid: data.paymentData.txnid,
          timestamp: Date.now()
        }));
        
        // Create and submit form to PayU
        const form = document.createElement('form');
        form.method = 'post';
        form.action = data.payu_url;

        Object.entries(data.paymentData).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.error("Payment Error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  // Function to check pending payments (call this from your Home page)
  const checkPendingPayment = async () => {
    const pendingPayment = JSON.parse(localStorage.getItem('pendingPayment'));
    if (!pendingPayment) return;

    // Clear the pending payment immediately to prevent repeated checks
    localStorage.removeItem('pendingPayment');

    // Only consider payments initiated in the last 30 minutes
    if (Date.now() - pendingPayment.timestamp > 30 * 60 * 1000) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "https://wallet-application-iglo.onrender.com/api/payment/verify",
        { txnid: pendingPayment.txnid }
      );

      if (response.data.success) {
        navigate('/payment/success', {
          state: {
            txnid: response.data.txnid,
            amount: response.data.amount,
            status: 'success'
          }
        });
      } else {
        navigate('/payment/failure', {
          state: {
            error: response.data.error || 'Payment verification failed'
          }
        });
      }
    } catch (error) {
      navigate('/payment/failure', {
        state: {
          error: 'Error verifying payment'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="mt-10">
      <Box className="bg-white p-6 rounded-xl shadow-md">
        <Typography variant="h5" className="text-center mb-4 font-bold flex items-center justify-center">
          <Payment className="mr-2" /> PayU Payment
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField 
            fullWidth 
            margin="normal" 
            label="Amount" 
            name="amount" 
            value={formData.amount} 
            onChange={handleChange} 
            required 
          />
          <TextField 
            fullWidth 
            margin="normal" 
            label="First Name" 
            name="firstname" 
            value={formData.firstname} 
            onChange={handleChange} 
            required 
          />
          <TextField 
            fullWidth 
            margin="normal" 
            label="Email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <TextField 
            fullWidth 
            margin="normal" 
            label="Phone" 
            name="phone" 
            type="tel" 
            value={formData.phone} 
            onChange={handleChange} 
            required 
          />
          <TextField 
            fullWidth 
            margin="normal" 
            label="Product Info" 
            name="productinfo" 
            value={formData.productinfo} 
            onChange={handleChange} 
            required 
          />

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            className="mt-4" 
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default PaymentForm;