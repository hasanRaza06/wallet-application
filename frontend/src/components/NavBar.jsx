import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { RiCloseLargeFill } from "react-icons/ri";
import { User, Users, History, Landmark, Wallet } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import Profile from "./Profile";
import UsersPage from "./User";
import UserBank from "./UserBank";

// Dummy page components
const HistoryPage = () => <div className="p-4">History Page</div>;
const WalletPage = () => <div className="p-4">Wallet Page</div>;


export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [activePage, setActivePage] = useState("Profile"); // Track active page
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleDrawer = () => setOpen(!open);

  // Menu Items with Icons and Page Mapping
  const menuItems = [
    { name: "Profile", icon: <User size={18} />, component: <Profile /> },
    { name: "Users", icon: <Users size={18} />, component: <UsersPage /> },
    { name: "Bank", icon: <Landmark size={18} />, component: <UserBank /> },
    { name: "Wallet", icon: <Wallet size={18} />, component: <WalletPage /> },
    { name: "History", icon: <History size={18} />, component: <HistoryPage /> },
  ];

  // Drawer Content
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <div className="flex justify-end mt-4 mr-2">
        <RiCloseLargeFill className="h-6 w-6 cursor-pointer" onClick={toggleDrawer} />
      </div>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              onClick={() => {
                setActivePage(item.name); // Change active page
                if (isMobile) setOpen(false); // Close drawer on mobile
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Navigation Bar */}
      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          width: isMobile ? "100%" : open ? `calc(100% - 250px)` : "100%",
          marginLeft: isMobile ? 0 : open ? 250 : 0,
          transition: "margin 0.3s ease, width 0.3s ease",
        }}
      >
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }} onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Wallet Application</Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer variant={isMobile ? "temporary" : "persistent"} open={open} onClose={toggleDrawer}>
        {DrawerList}
      </Drawer>

      {/* Main Content - Moves when Drawer Opens */}
      <Box
        sx={{
          flexGrow: 1,
          p: 4,
          marginLeft: isMobile ? 0 : open ? "250px" : 0, // Shift content
          transition: "margin 0.3s ease",
        }}
      >
        {/* Push Content Down to Avoid Overlapping */}
        <Box sx={{ height: 64 }} />
        {menuItems.find((item) => item.name === activePage)?.component}
      </Box>
    </Box>
  );
}
