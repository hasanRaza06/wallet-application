import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Typography, Box, Button } from "@mui/material";

const Failure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get error from state or URL query
  const error = location.state?.error || 
                new URLSearchParams(window.location.search).get('error') || 
                "Payment failed";

  useEffect(() => {
    // Clear the pending transaction
    sessionStorage.removeItem('pendingTxnId');
  }, []);

  return (
    <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <Box sx={{ textAlign: "center", padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" color="error.main" fontWeight="bold">
          Payment Failed!
        </Typography>
        <Typography variant="h6" mt={2} color="text.secondary">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 3 }}
          onClick={() => navigate("/payment")} // Or your payment page
        >
          Try Again
        </Button>
      </Box>
    </Container>
  );
};

export default Failure;