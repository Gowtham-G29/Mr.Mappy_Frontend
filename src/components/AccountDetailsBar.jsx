/* eslint-disable react/prop-types */
import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useState, useEffect } from "react";
import { getUserDetails } from "../services/api"; // Adjust path as needed
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { Button } from "@mui/material";
import SettingsIcon from "./settingsIcon";

export default function AccountDetailsBar({ drawerOpen }) {
  const [anchorEl, setAnchorEl] = React.useState(null);



  const [name, setName] = useState(" Mappy ");
  // const [photo, setphoto] = useState(null); // State to store the selected photo
  const [userId, setUserId] = useState(null); // State for user ID

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Fetch user details when the component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getUserDetails();
        setName(response.data.user.name);
        setUserId(response.data.user._id);
        // setphoto(response.data.photo); // Set the photo URL if available
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          {!drawerOpen && <AccountCircle sx={{ fontSize: "2.5rem" }} />}
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {/* Link to /userInfo */}
          <Link to="/userInfo" className="w-full">
            <div className="flex justify-center items-center mb-4">
              <Button color="secondary" variant="contained">
                <MenuItem onClick={handleClose}>Update Profile   <SettingsIcon/></MenuItem>
              </Button>
            </div>
          </Link>

          <div>
            <MenuItem disabled>Name:{name}</MenuItem>
            <MenuItem disabled>User ID:{userId}</MenuItem>
          </div>
        </Menu>
      </div>
    </Box>
  );
}
