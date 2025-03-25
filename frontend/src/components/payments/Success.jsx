import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Typography, Box, CircularProgress } from "@mui/material";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { txnid, amount } = location.state || {};

  useEffect(() => {
    if (!txnid) {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => navigate("/"), 5000);
    return () => clearTimeout(timer);
  }, [txnid, navigate]);

  if (!txnid) {
    return (
      <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Redirecting...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <Box sx={{ textAlign: "center", padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" color="success.main" fontWeight="bold">
          Payment Successful!
        </Typography>
        <Typography variant="h6" mt={2}>Transaction ID: {txnid}</Typography>
        <Typography variant="h6" mt={1}>Amount: ₹{amount}</Typography>
        <Typography variant="body1" color="textSecondary" mt={3}>
          You will be redirected to the home page shortly...
        </Typography>
      </Box>
    </Container>
  );
};

export default Success;
