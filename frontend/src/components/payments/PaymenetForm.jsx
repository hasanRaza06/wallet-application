import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { Payment } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Initiate payment with backend
      const { data } = await axios.post(
        "https://wallet-application-iglo.onrender.com/api/payment/pay",
        formData
      );

      if (data.success) {
        // 2. Store transaction ID temporarily
        sessionStorage.setItem('pendingTxnId', data.paymentData.txnid);
        
        // 3. Create and submit form to PayU
        const form = document.createElement('form');
        form.method = 'post';
        form.action = data.payu_url;

        // Add all payment data as hidden inputs
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
      console.error("Payment error:", error);
      navigate('/payment/failure', {
        state: { error: error.response?.data?.message || "Payment initiation failed" }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Box sx={{ backgroundColor: "white", padding: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" align="center" fontWeight="bold" mb={2}>
          <Payment sx={{ verticalAlign: "middle", marginRight: 1 }} />
          PayU Payment
        </Typography>
        <form onSubmit={handleSubmit}>
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
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2 }} 
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