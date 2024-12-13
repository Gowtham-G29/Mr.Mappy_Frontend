import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import WhereToVoteIcon from "@mui/icons-material/WhereToVote";
import TemporaryDrawer from "./SideDrawer";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ButtonAppBar() {
  const navigate = useNavigate();

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
            <WhereToVoteIcon fontSize="large" sx={{ cursor: "pointer" }} />

            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1, cursor: "pointer", fontWeight: "bolder" }}
            >
              Mr.Mappy
            </Typography>

            <Button
              className="laptop:hidden"
              color="secondary"
              variant="contained"
              onClick={() => navigate("/dashboard")}
            >
              Go BACK TO HOME
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
