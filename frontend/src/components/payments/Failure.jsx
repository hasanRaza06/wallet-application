import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Error, Refresh, Home } from '@mui/icons-material';

const Failure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error } = location.state || {};

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        <Error
          sx={{
            fontSize: 80,
            color: 'error.main',
            mb: 2,
          }}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          Payment Failed
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {error || 'We\'re sorry, but your payment could not be processed.'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            startIcon={<Refresh />}
            onClick={() => navigate('/')}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            Try Again
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Home />}
            onClick={() => navigate('/')}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            Return Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Failure;