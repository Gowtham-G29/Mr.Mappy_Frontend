import WhereToVoteIcon from "@mui/icons-material/WhereToVote";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useState } from "react";

import FloatingActionButtonExtendedSize from "./FloatingLogoutButton";
import CurrentPosition from "./CurrentLocation";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/Auth";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import MapComponent from "./MapComponent";
import ActionForm from "./ActionForm";
// import EntryList from "./EntryList";
import SideDrawerIcon from "./SideDrawerIcon";
import AlertDialogModal from "./LogoutConfirmationModal";
import axios from "axios";
import AccountDetailsBar from "./AccountDetailsBar";
import LogModal from "./LogModal";

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function AppDrawer() {
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const [moneySpending, setMoneySpending] = useState([]); // Initialize as an empty array
  const [workout, setWorkout] = useState([]); // Initialize as an empty array
  const [hangout, setHangout] = useState([]); // Initialize as an empty array
  const [visiting, setVisiting] = useState([]); // Initialize as an empty array

  const [visibleItems, setVisibleItems] = useState(5); // Initial number of visible items
  const [formVisible, setFormVisible] = useState(false);

  const [storedEntries, setStoredEntries] = useState([]);
  // const [currentLocation, setCurrentLocation] = useState(false); // need to check
  const [markerVisible, setMarkerVisible] = useState(false);

  const [navigateButton, setNavigateButton] = useState(false);
  const [logoutModelOpen, setLogoutModelOpen] = useState(false);

  const [action, setAction] = useState("");
  const [clickedCoords, setClickedCoords] = useState(null); // State to store coordinates

  const handleLogoutModelOpen = () => {
    setLogoutModelOpen(true);
  };

  const handleLogoutModelClose = () => {
    setLogoutModelOpen(false);
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        `https://mr-mappy-backend-node.onrender.com/api/v1/activities/getActivity`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const entries = response.data.activities;
        // Check if entries is an array before attempting to filter
        if (Array.isArray(entries)) {
          setStoredEntries(entries);
          const moneySpendingEntries = entries.filter(
            (entry) => entry.type === "Money spending"
          );
          const workoutEntries = entries.filter(
            (entry) => entry.type === "Workout"
          );
          const hangoutEntries = entries.filter(
            (entry) => entry.type === "Hangout"
          );
          const visitingEntries = entries.filter(
            (entry) => entry.type === "Visiting"
          );

          setMoneySpending(moneySpendingEntries);
          setWorkout(workoutEntries);
          setHangout(hangoutEntries);
          setVisiting(visitingEntries);
        } else {
          console.error("Entries is not an array:", entries);
        }
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };
  // Call fetchActivities inside useEffect when User_Id changes
  useEffect(() => {
    fetchActivities();
  }, []);

  //pass this to side drawer entry list.
  const refreshActivities = () => {
    fetchActivities();
  };

  const handleDrawerOpen = () => {
    refreshActivities(); //open the sidedrwaer the data fetch again happened
    setOpen(true);
    setFormVisible(false);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    refreshActivities();
  };

  const handleAction = (e) => {
    setAction(e.target.value);
  };

  // Handle map click and set coordinates
  const handleMapClick = (coords) => {
    setFormVisible(true);
    setClickedCoords(coords); // Store the coordinates in state
    handleDrawerClose(); //if the map is clicked the deawer is closed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let newEntry = {};

    // Include coordinates in the form data
    if (clickedCoords) {
      formData.append("lat", `${clickedCoords.lat}`);
      formData.append("lng", `${clickedCoords.lng}`);
    }

    switch (action) {
      case "Money spending":
        newEntry = {
          type: "Money spending",
          amount: formData.get("amount"),
          investedFor: formData.get("investedFor"),
        };
        setMoneySpending((prev) => [...prev, newEntry]);
        break;
      case "Workout":
        newEntry = {
          type: "Workout",
          workoutName: formData.get("workoutName"),
          workoutDuration: formData.get("workoutDuration"),
          caloriesBurned: formData.get("caloriesBurned"),
        };
        setWorkout((prev) => [...prev, newEntry]);
        break;
      case "Hangout":
        newEntry = {
          type: "Hangout",
          place: formData.get("placeName"),
          spendingDuration: formData.get("spendingDuration"),
          memorableMoments: formData.get("memorableMoments"),
        };
        setHangout((prev) => [...prev, newEntry]);
        break;
      case "Visiting":
        newEntry = {
          type: "Visiting",
          placeName: formData.get("placeName"),
          spendingDuration: formData.get("spendingDuration"),
          motive: formData.get("motive"),
        };
        setVisiting((prev) => [...prev, newEntry]);
        break;
      default:
        break;
    }

    newEntry.lat = Number(formData.get("lat"));
    newEntry.lng = Number(formData.get("lng"));


    try {
      await axios.post(
        "https://mr-mappy-backend-node.onrender.com/api/v1/activities/newActivity",
        {
          ...newEntry,
        },
        { withCredentials: true }
      );

      // Update the UI
      setMarkerVisible(true); // Add marker to the map
      e.target.reset(); // Reset the form
      setAction("");
      setFormVisible(false); // Close the form
    } catch (error) {
      // Handle errors
      if (error.response) {
        // Server responded with a status outside the range of 2xx
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        // No response received from the server
        console.error("Request error:", error.request);
      } else {
        // Something else caused the error
        console.error("Unexpected error:", error.message);
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormVisible(false); // Hide form after submission
  };

  // Function to load more items
  const loadMoreItems = () => {
    setVisibleItems((prev) => prev + 5); // Load 5 more items each time
  };

  const handleCancel = () => {
    setFormVisible(false);
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return (
    <Box sx={{ display: "flex" }} className="overflow-hidden">
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        className="bg-gradient-to-r from-sky-500 to-indigo-500 shadow-xl"
      >
        <Toolbar className="flex-row">
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <WhereToVoteIcon fontSize="large" sx={{ cursor: "pointer" }} />

          <Typography variant="h6" noWrap component="div">
            Mr.Mappy
          </Typography>

          <div style={{ marginLeft: "auto" }}>
            <AccountDetailsBar drawerOpen={open} />
          </div>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader className="bg-gradient-to-l from-sky-500 to-indigo-500 ">
          <Typography variant="h5" className="text-slate-200 ">
            {" "}
            Your Logs📍
          </Typography>

          <div>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
        </DrawerHeader>

        {/* <Divider /> */}

        {open ? (
          <div className="flex flex-col items-center bg-gradient-to-l from-sky-500 to-indigo-500  overflow-auto overflow-x-hidden h-full  ">
            <LogModal
              visibleItems={visibleItems}
              moneySpending={moneySpending}
              workout={workout}
              hangout={hangout}
              visiting={visiting}
              loadMoreItems={loadMoreItems} // Pass the function here
              closeLogmodel={handleDrawerClose}
            />
          </div>
        ) : (
          <SideDrawerIcon handleDrawerOpen={handleDrawerOpen} />
        )}
      </Drawer>

      {/* Map container */}
      <Box
        className="w-screen scrollbar-hide"
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden", // Prevent scrolling in the Y direction
          height: "100vh", // Ensure the container takes the full height of the viewport
        }}
      >
        <DrawerHeader />
        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden", // Prevent scrolling inside the map container
          }}
        >
          {/* Full-screen map */}

          <MapComponent
            style={{ width: "100%", height: "100%" }}
            handleMapClick={handleMapClick}
            storedMarker={storedEntries}
            // navigateCurrentLocation={setCurrentLocation}
            markerVisible={markerVisible}
            // onCurrentPositionFocus={setFocusCurrentPosition} // Pass the setter for focusing
            navigateButton={navigateButton}
            setNavigateButton={setNavigateButton}
          />

          {/* Floating form */}
          {formVisible && (
            <Box
              sx={{
                position: "absolute",
                top: 35, // Adjust positioning as needed
                left: 20, // Adjust positioning as needed
                zIndex: 1000, // Ensure the form is above the map
                backgroundColor: "white", // Optional: background to make form stand out
                padding: 2, // Add padding for better form layout
                borderRadius: 2, // Optional: rounded corners
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Optional: subtle shadow for better visibility
                overflow: "hidden", // Allow scrolling inside the form if content overflows
                maxHeight: "90vh", // Restrict the form's height to fit within the viewport
              }}
            >
              <ActionForm
                action={action}
                handleSubmit={handleSubmit}
                handleAction={handleAction}
                handleFormSubmit={handleFormSubmit}
                setMarkerVisible={setMarkerVisible}
                handleCancel={handleCancel}
              />
            </Box>
          )}
        </Box>
      </Box>

      <AlertDialogModal
        logoutModelOpen={logoutModelOpen}
        handleLogoutModelClose={handleLogoutModelClose}
      />

      <div
        onClick={() => {
          setNavigateButton(true);
        }}
      >
        <CurrentPosition />
      </div>

      {!formVisible && (
        <FloatingActionButtonExtendedSize
          handleLogoutModelOpen={handleLogoutModelOpen}
        />
      )}
    </Box>
  );
}
