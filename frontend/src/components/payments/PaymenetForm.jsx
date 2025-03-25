import { useState } from "react";
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("https://wallet-application-iglo.onrender.com/api/payment/pay", {
        txnid: `txn_${Date.now()}`,
        amount: formData.amount,
        productinfo: formData.productinfo,
        firstname: formData.firstname,
        email: formData.email,
        phone: formData.phone,
        surl: "https://wallet-application-iglo.onrender.com/api/payment/success",
        furl: "https://wallet-application-iglo.onrender.com/api/payment/failure",
      });
  
      if (data.success) {
        window.location.href = `${data.payu_url}?${new URLSearchParams(data.paymentData).toString()}`;
      }
    } catch (error) {
      console.error("Payment Error:", error.response?.data?.error || error.message);
    }
    setLoading(false);
  };
  
  
  

  return (
    <Container maxWidth="sm" className="mt-10">
      <Box className="bg-white p-6 rounded-xl shadow-md">
        <Typography variant="h5" className="text-center mb-4 font-bold flex items-center justify-center">
          <Payment className="mr-2" /> PayU Payment
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Amount" name="amount" value={formData.amount} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="First Name" name="firstname" value={formData.firstname} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Product Info" name="productinfo" value={formData.productinfo} onChange={handleChange} required />

          <Button type="submit" variant="contained" color="primary" fullWidth className="mt-4" disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default PaymentForm;
