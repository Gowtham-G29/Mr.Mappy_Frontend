/* eslint-disable react/prop-types */
import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useState, useEffect } from "react";
import { getUserDetails } from "../services/api"; // Adjust path as needed
import { loginUserId } from "../services/Storage";

export default function AccountDetailsBar({ drawerOpen }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userDetails, setUserDetails] = useState({ name: "", email: "" });
  const [error, setError] = useState(null);
    
  const user_Id=loginUserId();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Adjust according to your auth logic
    if (token) {
      getUserDetails(token)
        .then((data) => {
          if (data) {
            setUserDetails({ name: data.name, email: data.email });
          } else {
            setError("Failed to fetch user details");
          }
        })
        .catch((err) => {
          setError("Error fetching user details", err);
        });
    } else {
      setError("No token found");
    }
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
          <MenuItem onClick={handleClose}>My Profile</MenuItem>
          {userDetails.name && userDetails.email ? (
            <div>
              <MenuItem disabled>Name: {userDetails.name}</MenuItem>
              <MenuItem disabled>Email: {userDetails.email}</MenuItem>
              <MenuItem disabled>Unique ID: {user_Id}</MenuItem>
            </div>
          ) : (
            <MenuItem disabled>{error || "Loading..."}</MenuItem>
          )}
        </Menu>
      </div>
    </Box>
  );
}
