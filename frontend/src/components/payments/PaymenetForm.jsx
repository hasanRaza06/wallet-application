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

  useEffect(() => {
    if (!location.state?.txnid) {
      return; // Do nothing if txnid is missing
    }
    verifyPayment(location.state.txnid);
  }, [location.state]);

  const verifyPayment = async (txnid) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://wallet-application-iglo.onrender.com/api/payment/verify",
        { txnid }
      );

      if (response.data.success) {
        navigate("/payment/success", {
          state: {
            txnid: response.data.txnid,
            amount: response.data.amount,
            status: "success",
          },
        });
      } else {
        navigate("/payment/failure", {
          state: { error: response.data.error || "Payment verification failed" },
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      navigate("/payment/failure", { state: { error: "Verification error" } });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        // ✅ Redirect to PayU, do NOT verify immediately
        navigate("/payment", {
          state: { txnid: data.paymentData.txnid },
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Payment failed. Please try again.");
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
            />
          ))}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default PaymentForm;
