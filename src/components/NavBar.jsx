import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import WhereToVoteIcon from "@mui/icons-material/WhereToVote";
import TemporaryDrawer from "./SideDrawer";
import { useEffect, useState } from "react";

export default function ButtonAppBar() {
  const [buttonState, setButtonState] = useState(false);
  const [homestate, setHomeState] = useState(true);
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const location = useLocation();

  // Update buttonState based on the current path
  useEffect(() => {
    const pathsWithButton = ["/login"];
    setButtonState(pathsWithButton.includes(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    const pathsWithButton = ["/"];
    setHomeState(pathsWithButton.includes(location.pathname));
  }, [location.pathname]);

  function navigateRegister() {
    navigate("/register"); // Navigate to the /register route
  }

  function navigateLogin() {
    navigate("/login");
  }

  function navigationHome() {
    navigate("/");
  }

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          className="py-5 bg-gradient-to-r from-sky-500 to-indigo-500"
        >
          <Toolbar>
            <div>
              {/* Show drawer on smaller screens */}
              <div className="block laptop:hidden ">
                <TemporaryDrawer />
              </div>
            </div>

            {/* Icon and title, which will always be visible */}
            <WhereToVoteIcon
              fontSize="large"
              onClick={navigationHome}
              sx={{ cursor: "pointer" }}
            />

            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1, cursor: "pointer", fontWeight: "bolder" }}
              onClick={navigationHome}
            >
              Mr.Mappy
            </Typography>

            {!buttonState ? (
              <div className=" laptop:hidden">
                <Button
                  onClick={navigateLogin}
                  variant="contained"
                  color="success"
                >
                  Sign In
                </Button>
              </div>
            ) : (
              <div className=" laptop:hidden">
                <Button
                  onClick={navigateRegister}
                  variant="contained"
                  color="success"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Show buttons and links on larger screens */}
            <div className=" hidden laptop:flex space-x-5 items-center">
              {!homestate ? (
                <Link to="/">
                  <Typography variant="h6">Home</Typography>
                </Link>
              ) : null}

              <Typography variant="h6">About</Typography>
              <Typography variant="h6">Help?</Typography>

              {buttonState ? (
                <Button
                  onClick={navigateRegister}
                  variant="contained"
                  color="success"
                >
                  Register
                </Button>
              ) : (
                <Button
                  onClick={navigateLogin}
                  variant="contained"
                  color="success"
                 
                >
                  Login
                </Button>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
