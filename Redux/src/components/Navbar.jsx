import React, { useEffect } from 'react';
import {
  AppBar, Box, Toolbar, Typography, IconButton, Drawer, Button,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import * as MuiIcons from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetail } from '../redux/slice';
import useMediaQuery from '@mui/material/useMediaQuery';

const drawerWidth = 240;

const Navbar = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.counter.userDetail);
  const listItems = useSelector((state) => state.counter.listItems);

  const isLargeScreen = useMediaQuery('(min-width:1024px)'); // Adjust breakpoint if needed

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userDetail"));
    if (userData) {
      dispatch(setUserDetail(userData));
    }
  }, []);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: drawerWidth }} role="presentation">
      <List>
        {listItems.map(({ icon, name }) => {
          const IconComponent = MuiIcons[icon] || MuiIcons.Settings;
          return (
            <ListItem key={name} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <IconComponent />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: isLargeScreen && open ? `calc(100% - ${drawerWidth}px)` : '100%',
          ml: isLargeScreen && open ? `${drawerWidth}px` : 0,
          transition: 'width 0.3s ease, margin 0.3s ease'
        }}
      >
        <Toolbar>
          {!isLargeScreen && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, ml: 2 }}>
            Paytm
          </Typography>
          {
            user ? <Typography>Welcome {user.name}</Typography> : <Button color="inherit">Login</Button>
          }
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isLargeScreen ? 'persistent' : 'temporary'}
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {isLargeScreen && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        {DrawerList}
      </Drawer>
    </>
  );
};

export default Navbar;
