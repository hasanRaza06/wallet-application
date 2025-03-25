import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Typography, Box, CircularProgress } from "@mui/material";

const Failure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = location.state?.error || "";

  useEffect(() => {
    if (!errorMessage) {
      navigate("/"); // Redirect immediately if no error exists
      return;
    }

    const timer = setTimeout(() => navigate("/"), 5000);
    return () => clearTimeout(timer);
  }, [errorMessage, navigate]);

  return (
    <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <Box sx={{ textAlign: "center", padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" color="error.main" fontWeight="bold">
          Payment Failed!
        </Typography>
        <Typography variant="h6" mt={2} color="text.secondary">
          {errorMessage || "Something went wrong."}
        </Typography>
        <Typography variant="body1" color="textSecondary" mt={3}>
          You will be redirected to the home page shortly...
        </Typography>
      </Box>
    </Container>
  );
};

export default Failure;
