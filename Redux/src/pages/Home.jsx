import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetail } from '../redux/slice';
import Navbar from '../components/Navbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptIcon from '@mui/icons-material/ReceiptLong';

const drawerWidth = 240;

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.counter.userDetail);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userDetail"));
    if (userData) {
      dispatch(setUserDetail(userData));
    }
  }, [dispatch]);

  const cardData = [
    {
      title: 'Wallet',
      description: 'View your wallet balance and recent activity.',
      icon: <WalletIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Account',
      description: 'Manage your account settings and profile.',
      icon: <AccountCircleIcon fontSize="large" color="success" />,
    },
    {
      title: 'Transactions',
      description: 'Check all your past transactions and payments.',
      icon: <ReceiptIcon fontSize="large" color="error" />,
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar open={open} setOpen={setOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: 'margin 0.3s ease',
          ml: open ? `${drawerWidth}px` : 0,
          mt: '64px',
        }}
      >
       <Grid container spacing={3}>
  {cardData.map(({ title, description, icon }) => (
    <Grid item xs={12} sm={6} md={4} key={title}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          p: 2,
          m: { xs: 1 },
          height: '100%',
          boxShadow: 3,
          borderRadius: 3,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        }}
      >
        {icon}
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>


      </Box>
    </Box>
  );
};

export default Home;

