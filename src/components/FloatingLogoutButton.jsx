/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import LogoutIcon from "@mui/icons-material/Logout";

export default function FloatingActionButtonExtendedSize({handleLogoutModelOpen}) {
  return (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
      <Fab 
      className="bg-gradient-to-r from-sky-500 to-indigo-500"
        variant="extended"
        
        onClick={handleLogoutModelOpen}
        sx={{
          position: "absolute",
          top: 80,
          right: 16,
          color:'white'
        }}
      >
        <LogoutIcon />
        Logout
      </Fab>
    </Box>
  );
}
