import { Cancel } from "@mui/icons-material";
import { Container, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Failure = () => (
  <Container maxWidth="sm" className="mt-10">
    <Box className="bg-red-100 p-6 rounded-xl text-center shadow-md">
      <Cancel className="text-red-600 text-5xl" />
      <Typography variant="h5" className="mt-2 font-bold">Payment Failed</Typography>
      <Typography className="mt-2">Something went wrong. Please try again.</Typography>
      <Button variant="contained" color="primary" className="mt-4" component={Link} to="/">Try Again</Button>
    </Box>
  </Container>
);

export default Failure;
