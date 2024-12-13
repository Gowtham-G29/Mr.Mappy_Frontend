/* eslint-disable react/prop-types */
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { List, ListItem, Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import { getUserActivities } from "../services/api";

export default function LogModal({
  visibleItems,
  moneySpending,
  workout,
  hangout,
  visiting,
  loadMoreItems,
  closeLogmodel
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Dialog state for individual activities
  const [openDialogs, setOpenDialogs] = React.useState({});

  const handleClickOpen = (activityId) => {
    setOpenDialogs((prev) => ({ ...prev, [activityId]: true }));
  };

  const handleClose = (activityId) => {
    setOpenDialogs((prev) => ({ ...prev, [activityId]: false }));
  };

  const deleteActivity = async (activityId) => {
    try {
      // Send DELETE request to your API
      await axios.delete(
        `https://mr-mappy-backend-node.onrender.com/api/v1/activities/${activityId}`,
        { withCredentials: true }
      );
      await getUserActivities();
      loadMoreItems();
    } catch (error) {
      // Handle any error that occurred during the request
      console.error("Error deleting activity:", error);
      alert("Failed to delete activity. Please try again.");
    }
  };

  const renderActivity = (entry) => (
    <ListItem key={entry._id}>
      <Card className="bg-slate-300 shadow-md">
        <CardContent className="flex flex-col w-48 bg-blue-200">
          <Typography className="text-center" sx={{ fontWeight: "bold" }}>
            {entry.type === "Money spending"
              ? "Money Spending"
              : entry.type === "Hangout"
              ? "Hangout"
              : entry.type === "Workout"
              ? "Workout"
              : entry.type === "Visiting"
              ? "Visiting"
              : null}
          </Typography>

          <br />
          {/* Display details based on activity type */}
          {entry.type === "Money spending" && (
            <div className="text-center">
              <Typography variant="subtitle2">
                Amount 💸: {entry.details?.amount || "N/A"}
              </Typography>
              <Typography variant="subtitle2">
                Date:{" "}
                {entry.activityTime
                  ? new Date(entry.activityTime).toLocaleDateString()
                  : "N/A"}
                <br />
              </Typography>
            </div>
          )}
          {entry.type === "Workout" && (
            <div className="text-center">
              <Typography variant="subtitle2">
                Type 🚴🏻‍♂️: {entry.details?.workoutName || "N/A"}
              </Typography>
              <Typography variant="subtitle2">
                Date:{" "}
                {entry.activityTime
                  ? new Date(entry.activityTime).toLocaleDateString()
                  : "N/A"}
                <br />
              </Typography>
            </div>
          )}
          {entry.type === "Hangout" && (
            <div className="text-center">
              <Typography variant="subtitle2">
                Location 📍: {entry.details?.place || "N/A"}
              </Typography>
              <Typography variant="subtitle2">
                Date:{" "}
                {entry.activityTime
                  ? new Date(entry.activityTime).toLocaleDateString()
                  : "N/A"}
                <br />
              </Typography>
            </div>
          )}
          {entry.type === "Visiting" && (
            <div className="text-center">
              <Typography variant="subtitle2">
                Place 🗺️: {entry.details?.placeName || "N/A"}
              </Typography>
              <Typography variant="subtitle2">
                Date:{" "}
                {entry.activityTime
                  ? new Date(entry.activityTime).toLocaleDateString()
                  : "N/A"}
              </Typography>
            </div>
          )}
          {/* Button to open dialog */}
          <Button
            onClick={() => handleClickOpen(entry._id)}
            variant="contained"
          >
            View & Delete
          </Button>
        </CardContent>
      </Card>

      {/* Separate dialog for each activity */}
      <Dialog
        fullScreen={fullScreen}
        open={openDialogs[entry._id] || false}
        onClose={() => handleClose(entry._id)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Delete this activity?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {entry.type === "Money spending" && (
              <>
                Amount: {entry.details?.amount || "N/A"} <br />
                Spended For: {entry.details?.investedFor || "N/A"} <br />
                Date:{" "}
                {entry.activityTime
                  ? new Date(entry.activityTime).toLocaleDateString()
                  : "N/A"}
                <br />
                Time:{" "}
                {entry.activityTime
                  ? new Date(entry.activityTime).toLocaleTimeString()
                  : "N/A"}
                <br />
                Location Coordinates: {entry.details?.lat || "N/A"} ,{" "}
                {entry.details?.lng || "N/A"}
              </>
            )}
            {entry.type === "Workout" && (
              <>
                Workout Name: {entry.details?.workoutName || "N/A"} <br />
                Duration: {entry.details?.workoutDuration || "N/A"} minutes{" "}
                <br />
                Calories Burned: {entry.details?.caloriesBurned || "N/A"} <br />
                Date:{" "}
                {entry.activityTime
                  ? new Date(entry.activityTime).toLocaleDateString()
                  : "N/A"}
                <br />
                Time:{" "}
                {entry.activityTime
                  ? new Date(entry.activityTime).toLocaleTimeString()
                  : "N/A"}
                <br />
                Location Coordinates: {entry.details?.lat || "N/A"} ,{" "}
                {entry.details?.lng || "N/A"}
              </>
            )}
            {entry.type === "Hangout" && (
              <>
                Location: {entry.details?.place || "N/A"} <br />
                Duration: {entry.details?.spendingDuration || "N/A"} <br />
                Description: {entry.details?.memorableMoments || "N/A"} <br />
                Date:{" "}
                {entry.activityTime
                  ? new Date(entry.activityTime).toLocaleDateString()
                  : "N/A"}
                <br />
                Time:{" "}
                {entry.activityTime
                  ? new Date(entry.activityTime).toLocaleTimeString()
                  : "N/A"}
                <br />
                Location Coordinates: {entry.details?.lat || "N/A"} ,{" "}
                {entry.details?.lng || "N/A"}
              </>
            )}
            {entry.type === "Visiting" && (
              <>
                Visiting Place: {entry.details?.placeName || "N/A"} <br />
                Purpose: {entry.details?.motive || "N/A"} <br />
                Duration: {entry.details?.spendingDuration || "N/A"} <br />
                Date:{" "}
                {entry.activityTime
                  ? new Date(entry.activityTime).toLocaleDateString()
                  : "N/A"}
                <br />
                Time:{" "}
                {entry.activityTime
                  ? new Date(entry.activityTime).toLocaleTimeString()
                  : "N/A"}
                <br />
                Location Coordinates: {entry.details?.lat || "N/A"} ,{" "}
                {entry.details?.lng || "N/A"}
              </>
            )}
            <br />
            <br />
            Are you sure you want to delete this activity? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(entry._id)} autoFocus>
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteActivity(entry._id);
              handleClose(entry._id);
              closeLogmodel();
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ListItem>
  );

  const totalItems =
    moneySpending.length + workout.length + hangout.length + visiting.length;

  return (
    <>
      <List>
        {!totalItems && (
          <Typography
            className="shadow-xl text-center text-white"
            variant="h6"
            component="h6"
          >
            No logs Found 📝
          </Typography>
        )}

        {/* Render Money Spending Section */}

        {moneySpending
          .slice(0, visibleItems)
          .map((entry) => renderActivity(entry))}

        {/* Render Workout Section */}
        {workout
          .slice(0, visibleItems)
          .map((entry) => renderActivity(entry))}

        {/* Render Hangout Section */}
        {hangout
          .slice(0, visibleItems)
          .map((entry) => renderActivity(entry))}

        {/* Render Visiting Section */}
        {visiting
          .slice(0, visibleItems)
          .map((entry) => renderActivity(entry))}

        {/* Load More Button */}
        <div className="text-center">
          {visibleItems < totalItems && (
            <Button
              onClick={loadMoreItems}
              variant="contained"
              sx={{ margin: 2, backgroundColor: "#7A1CAC" }}
            >
              Load More
            </Button>
          )}
        </div>
      </List>
    </>
  );
}
