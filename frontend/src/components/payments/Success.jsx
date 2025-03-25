import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Typography, Box, Button } from "@mui/material";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get parameters from both state and URL query
  const txnid = location.state?.txnid || new URLSearchParams(window.location.search).get('txnid');
  const amount = location.state?.amount || new URLSearchParams(window.location.search).get('amount');

  useEffect(() => {
    if (!txnid) {
      navigate("/");
      return;
    }
    
    // Clear the pending transaction
    sessionStorage.removeItem('pendingTxnId');
    
    // Optional: Verify payment with backend
    // verifyPayment(txnid);
  }, [txnid, navigate]);

  return (
    <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <Box sx={{ textAlign: "center", padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" color="success.main" fontWeight="bold">
          Payment Successful!
        </Typography>
        {txnid && <Typography variant="h6" mt={2}>Transaction ID: {txnid}</Typography>}
        {amount && <Typography variant="h6" mt={1}>Amount: ₹{amount}</Typography>}
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 3 }}
          onClick={() => navigate("/")}
        >
          Return to Home
        </Button>
      </Box>
    </Container>
  );
};

export default Success;