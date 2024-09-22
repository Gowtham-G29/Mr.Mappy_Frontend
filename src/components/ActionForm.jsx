/* eslint-disable react/prop-types */
import { TextField, MenuItem, Button } from "@mui/material";

const ActionForm = ({ action, handleSubmit, handleAction, handleCancel }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-slate-100 p-10 shadow-2xl">
        <div className="flex flex-col space-y-10">
          <TextField
            name="type"
            id="action-select"
            label="Select Action"
            select
            value={action}
            onChange={handleAction}
            helperText="Please select your action type"
            fullWidth
            required
            maxLength={12}
          >
            {[
              { value: "Money spending", label: "Money spending 💰" },
              { value: "Workout", label: "Workout 🚴🏻" },
              { value: "Hangout", label: "Hangout 🕓" },
              { value: "Visiting", label: "Visiting 🏢" },
            ].map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {action === "Hangout" && (
            <>
              <TextField
                label="Hangout Spot"
                name="placeName"
                fullWidth
                id="place-Name"
                required
              />
              <TextField
                label="Spending Duration in Hrs"
                name="spendingDuration"
                type="number"
                maxLength="5"
                fullWidth
                id="spending-duration"
                required
              />

              <TextField
                label="Memorable Moment"
                name="memorableMoments"
                inputProps={{ maxLength: 12 }}
                id="memorable-moments"
                placeholder="Describe moments"
                required
              />
            </>
          )}

          {action === "Money spending" && (
            <>
              <TextField
                label="Amount"
                name="amount"
                type="number"
                fullWidth
                id="amount"
                required
              />
              <TextField
                label="Invested For"
                name="investedFor"
                inputProps={{ maxLength: 12 }}
                id="invested-for"
                multiline
                maxRows={4}
                fullWidth
                required
              />
            </>
          )}

          {action === "Workout" && (
            <>
              <TextField
                label="Workout Name"
                name="workoutName"
                inputProps={{ maxLength: 12 }}
                fullWidth
                id="workout-name"
                required
              />
              <TextField
                label="Workout Duration in Hrs"
                name="workoutDuration"
                type="number"
                fullWidth
                id="workout-duration"
                required
              />
              <TextField
                label="Calories Burned in cal"
                name="caloriesBurned"
                type="number"
                fullWidth
                id="calories-burned"
                required
              />
            </>
          )}

          {action === "Visiting" && (
            <>
              <TextField
                label="Place Name"
                name="placeName"
                fullWidth
                id="place-name"
                required
              />
              <TextField
                label="Spending Duration in Hrs"
                name="spendingDuration"
                type="number"
                fullWidth
                id="visiting-duration"
                required
              />
              <TextField
                label="Motive"
                name="motive"
                inputProps={{ maxLength: 12 }}
                fullWidth
                id="motive"
                required
              />
            </>
          )}

          <Button
            type="submit"
            variant="contained"
            color="error"
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <input
            className="bg-indigo-600 p-3 w-full text-md text-white rounded-md"
            type="submit"
            value={"Submit"}
          />
        </div>
      </div>
    </form>
  );
};

export default ActionForm;
