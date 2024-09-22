import  { useEffect, useState } from 'react';
import axios from 'axios';

function Test() {
    const [activities, setActivities] = useState(null);
    const userId = 1; // Replace with actual user ID

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/activities/${userId}`);
                setActivities(response.data);
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };

        fetchActivities();
    }, [userId]);

    if (!activities) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Activities for User {userId}</h1>

            <h2>Money Spending Activities</h2>
            <ul>
                {activities.moneySpending.map(activity => (
                    <li key={activity.activity_id}>
                        Amount: {activity.activity_amount}, Category: {activity.activity_category}, Time: {activity.activity_time}
                    </li>
                ))}
            </ul>

            <h2>Workout Activities</h2>
            <ul>
                {activities.workout.map(activity => (
                    <li key={activity.activity_id}>
                        Type: {activity.activity_type}, Duration: {activity.activity_duration} mins, Calories Burned: {activity.calories_burned}, Time: {activity.activity_time}
                    </li>
                ))}
            </ul>

            {/* Render other activity types similarly */}
        </div>
    );
}

export default Test;
