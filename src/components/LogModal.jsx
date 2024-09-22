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
import { loginUserId } from "../services/Storage";

export default function LogModal({
  visibleItems,
  moneySpending,
  workout,
  hangout,
  visiting,
  loadMoreItems,
  loadDbdata,
}) {
  const userId = loginUserId();
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

  const deleteActivity = (type, activityId) => {
    fetch(
      `http://localhost:5000/api/activities/${type}/${activityId}/${userId}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Activity deleted successfully") {
          loadDbdata(); // Refresh data after deletion
        }
      })
      .catch((error) => console.error("Error deleting activity:", error));
  };

  const renderActivity = (entry, type) => (
    <ListItem key={entry.activity_id}>
      <Card className="bg-slate-300 shadow-md">
        <CardContent className="flex flex-col w-48 bg-blue-200">
          <Typography className="text-center" sx={{ fontWeight: "bold" }}>
            {entry.type === "money_spending"
              ? "Money Spending"
              : entry.type === "hangout"
              ? "Hangout"
              : entry.type === "workout"
              ? "Workout"
              : entry.type === "visiting"
              ? "Visiting"
              : null}
          </Typography>

          <br />
          {/* Display details based on activity type */}
          {type === "money_spending" && (
            <div className="text-center">
              <Typography variant="subtitle2">
                Amount 💸: {entry.amount}
              </Typography>
              <Typography variant="subtitle2">
                Date: {new Date(entry.activity_time).toLocaleDateString()}
                <br />
              </Typography>
            </div>
          )}
          {type === "workout" && (
            <div className="text-center">
              <Typography variant="subtitle2">
                Type 🚴🏻‍♂️: {entry.workoutName}
              </Typography>
              <Typography variant="subtitle2">
                Date: {new Date(entry.activity_time).toLocaleDateString()}
                <br />
              </Typography>
            </div>
          )}
          {type === "hangout" && (
            <div className="text-center">
              <Typography variant="subtitle2">
                Location 📍: {entry.place}
              </Typography>
              <Typography variant="subtitle2">
                Date: {new Date(entry.activity_time).toLocaleDateString()}
                <br />
              </Typography>
            </div>
          )}
          {type === "visiting" && (
            <div className="text-center">
              <Typography variant="subtitle2">
                Place 🗺️: {entry.placeName}
              </Typography>
              <Typography variant="subtitle2">
                Date: {new Date(entry.activity_time).toLocaleDateString()}
              </Typography>
            </div>
          )}
          {/* Button to open dialog */}
          <Button
            onClick={() => handleClickOpen(entry.activity_id)}
            variant="contained"
          >
            View & Delete
          </Button>
        </CardContent>
      </Card>

      {/* Separate dialog for each activity */}
      <Dialog
        fullScreen={fullScreen}
        open={openDialogs[entry.activity_id] || false}
        onClose={() => handleClose(entry.activity_id)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Delete this activity?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {type === "money_spending" && (
              <>
                Amount: {entry.amount} <br />
                Spended For: {entry.investedFor} <br />
                Date: {new Date(entry.activity_time).toLocaleDateString()}{" "}
                <br />
                Time: {new Date(entry.activity_time).toLocaleTimeString()}
                <br />
                Location Coordinates: {entry.lat} , {entry.lng}
              </>
            )}
            {type === "workout" && (
              <>
                Workout Name: {entry.workoutName} <br />
                Duration: {entry.workoutDuration} minutes <br />
                Calories Burned: {entry.caloriesBurned} <br />
                Date: {new Date(entry.activity_time).toLocaleDateString()}{" "}
                <br />
                Time: {new Date(entry.activity_time).toLocaleTimeString()}
                <br />
                Location Coordinates: {entry.lat} , {entry.lng}
              </>
            )}
            {type === "hangout" && (
              <>
                Location: {entry.place} <br />
                Duration: {entry.spendingDuration} <br />
                Description: {entry.memorableMoments} <br />
                Date: {new Date(entry.activity_time).toLocaleDateString()}{" "}
                <br />
                Time: {new Date(entry.activity_time).toLocaleTimeString()}
                <br />
                Location Coordinates: {entry.lat} , {entry.lng}
              </>
            )}
            {type === "visiting" && (
              <>
                Visiting Place: {entry.placeName} <br />
                Purpose: {entry.motive} <br />
                Duration: {entry.spendingDuration} <br />
                Date: {new Date(entry.activity_time).toLocaleDateString()}{" "}
                <br />
                Time: {new Date(entry.activity_time).toLocaleTimeString()}
                <br />
                Location Coordinates: {entry.lat} , {entry.lng}
              </>
            )}
            <br />
            <br />
            Are you sure you want to delete this activity? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(entry.activity_id)} autoFocus>
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteActivity(type, entry.activity_id);
              handleClose(entry.activity_id);
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
          .map((entry) => renderActivity(entry, "money_spending"))}

        {/* Render Workout Section */}
        {workout
          .slice(0, visibleItems)
          .map((entry) => renderActivity(entry, "workout"))}

        {/* Render Hangout Section */}
        {hangout
          .slice(0, visibleItems)
          .map((entry) => renderActivity(entry, "hangout"))}

        {/* Render Visiting Section */}
        {visiting
          .slice(0, visibleItems)
          .map((entry) => renderActivity(entry, "visiting"))}

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
