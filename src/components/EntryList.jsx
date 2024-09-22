/* eslint-disable react/prop-types */
import {
  Button,
  Card,
  CardContent,
  // Divider,
  List,
  ListItem,
  Typography,
} from "@mui/material";

import { loginUserId } from "../services/Storage";
import DeleteButton from "./deleteButton";

function EntryList({
  visibleItems,
  moneySpending,
  workout,
  hangout,
  visiting,
  loadMoreItems,
  loadDbdata,
}) {
  const userId = loginUserId();

  const deleteActivity = (type, activityId, userId) => {
    console.log(`Deleting ${type} with ID ${activityId} for user ${userId}`);
    fetch(
      `http://localhost:5000/api/activities/${type}/${activityId}/${userId}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Response data:", data);
        if (data.message === "Activity deleted successfully") {
          console.log("Activity deleted");
          // Optionally, update the UI after the activity is deleted
        }
      })
      .catch((error) => console.error("Error deleting activity:", error));
  };

  //loaddb data has problem because it makes multiple requests.
  const handleDelete = (type, activityId) => {
    deleteActivity(type, activityId, userId); // Pass userId if needed
    loadDbdata();
  };

  // Calculate total items
  const totalItems =
    moneySpending.length + workout.length + hangout.length + visiting.length;
  return (
    <div className="flex flex-col px-20 py-full bg-gradient-to-l from-sky-500 to-indigo-500  overflow-auto h-full">
      <div>
        {/* Money Spending Section */}
        <List>
          {!totalItems ? (
            <Typography
              className="shadow-xl text-center text-white "
              variant="h6"
              component="h6"
            >
              No logs Found 📝
            </Typography>
          ) : null}

          {moneySpending.slice(0, visibleItems).map((entry, index) => (
            <ListItem key={index}>
              <Card className="bg-slate-300 shadow-md">
                <CardContent className="flex flex-col w-48 bg-blue-200 ">
                  <Typography className="font-bold text-center" variant="">
                    {entry.type}
                  </Typography>
                  <Typography variant="subtitle2">
                    Amount 💸: {entry.amount}
                  </Typography>
                  <Typography variant="subtitle2">
                    For ❓: {entry.investedFor}
                  </Typography>

                  <div
                    onClick={() => handleDelete(entry.type, entry.activity_id)}
                  >
                    <DeleteButton />
                  </div>

                  {/* <button >delete</button> */}
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>

        {/* <Divider /> */}

        {/* Workout Section */}
        <List>
          
          {workout.slice(0, visibleItems).map((entry, index) => (
            <ListItem key={index}>
              <Card className="bg-slate-300 shadow-md">
                <CardContent className="flex flex-col w-48 bg-blue-200">
                  <Typography className="font-bold text-center" variant="">
                    {entry.type}
                  </Typography>

                  <Typography variant="subtitle2">
                    Type 🚴🏻‍♂️: {entry.workoutName}
                  </Typography>
                  <Typography variant="subtitle2">
                    Duration 🕒: {entry.workoutDuration}
                  </Typography>
                  <Typography variant="subtitle2">
                    Calories 🥵: {entry.caloriesBurned}
                  </Typography>
                  <div
                    onClick={() => handleDelete(entry.type, entry.activity_id)}
                  >
                    <DeleteButton />
                  </div>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>

        {/* <Divider /> */}

        {/* Hangout Section */}
        <List>
          {hangout.slice(0, visibleItems).map((entry, index) => (
            <ListItem key={index}>
              <Card className="bg-slate-300 shadow-md">
                <CardContent className="flex flex-col w-48 bg-blue-200">
                  <Typography className="font-bold text-center" variant="">
                    {entry.type}
                  </Typography>
                  <Typography variant="subtitle2">
                    Place 🕒: {entry.place}
                  </Typography>
                  <Typography variant="subtitle2">
                    Duration 🕒: {entry.spendingDuration}
                  </Typography>
                  <Typography variant="subtitle2">
                    Moments 😇: {entry.memorableMoments}
                  </Typography>
                  <div
                    onClick={() => handleDelete(entry.type, entry.activity_id)}
                  >
                    <DeleteButton />
                  </div>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>

        {/* <Divider /> */}

        {/* Visiting Section */}
        <List>
          {visiting.slice(0, visibleItems).map((entry, index) => (
            <ListItem key={index}>
              <Card className="bg-slate-300 shadow-md">
                <CardContent className="flex flex-col w-48 bg-blue-200">
                  <Typography className="font-bold text-center" variant="">
                    {entry.type}
                  </Typography>

                  <Typography variant="subtitle2">
                    Place 📍: {entry.placeName}
                  </Typography>
                  <Typography variant="subtitle2">
                    Duration 🕓: {entry.spendingDuration}
                  </Typography>
                  <Typography variant="subtitle2">
                    Motive 👉🏻: {entry.motive}
                  </Typography>
                  <div
                    onClick={() => handleDelete(entry.type, entry.activity_id)}
                  >
                    <DeleteButton />
                  </div>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>

        {/* <Divider /> */}

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
      </div>
    </div>
  );
}

export default EntryList;
