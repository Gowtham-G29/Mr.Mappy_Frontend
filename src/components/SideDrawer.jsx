import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useState } from "react";

import MenuOpenSharpIcon from "@mui/icons-material/MenuOpenSharp";
import { Link } from "react-router-dom";

export default function TemporaryDrawer() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box
      className="bg-gradient-to-r from-slate-400 to-cyan-200"
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <div className="flex flex-col justify-center items-center space-y-64">
        <List>
          <div className="flex flex-col  mt-5 space-y-6 items-center font-semibold">
            <Link to="/">
              <ListItem className="mt-32">Home</ListItem>
            </Link>
            <Link to="/">
              <ListItem>About</ListItem>
            </Link>
            <Link to="/">
              <ListItem>Help?</ListItem>
            </Link>
            <Link to="/register">
              <ListItem>Register/Sign Up</ListItem>
            </Link>
            <Link to="/login">
              <ListItem>Login/Sign In</ListItem>
            </Link>
            {/* <Divider /> */}
          </div>
        </List>
        <p className="font-extrabold pb-11">Copyright &copy; Gowtham-G29</p>
      </div>
    </Box>
  );

  return (
    <div>
      <MenuOpenSharpIcon
        onClick={toggleDrawer(true)}
        sx={{ marginRight: "4.2rem", fontSize: "35px" }}
      />
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
