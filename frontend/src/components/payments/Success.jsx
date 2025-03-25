import { CheckCircle } from "@mui/icons-material";
import { Container, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Success = () => (
  <Container maxWidth="sm" className="mt-10">
    <Box className="bg-green-100 p-6 rounded-xl text-center shadow-md">
      <CheckCircle className="text-green-600 text-5xl" />
      <Typography variant="h5" className="mt-2 font-bold">Payment Successful!</Typography>
      <Typography className="mt-2">Thank you for your purchase.</Typography>
      <Button variant="contained" color="primary" className="mt-4" component={Link} to="/">Go Home</Button>
    </Box>
  </Container>
);

export default Success;
