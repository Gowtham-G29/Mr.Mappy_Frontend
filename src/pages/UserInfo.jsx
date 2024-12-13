import { useState } from "react";
import { Button, TextField } from "@mui/material";
import Footer from "../components/Footer";
import NavBar2 from "../components/NavBar2"
import {
  deleteAccount,
  getUserActivities,
  getUserDetails,
  updateCurrentUserPassword,
} from "../services/Api";
import { logout } from "../services/Auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function UserAccount() {
  const [name, setName] = useState(" ");
  const [email, setEmail] = useState(" ");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photo, setphoto] = useState(null); // State to store the selected photo
  const [userId, setUserId] = useState(null); // State for user ID
  const [status, setStatus] = useState("Inactive");


  const [actvityCount,setActivityCount]=useState(0);

  const handlephotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setphoto(file); // Store the file itself, not the Base64 string
    }
  };

  // Logout user
  const navigate = useNavigate();
  const logoutUser = () => {
    logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmation) {
      try {
        await deleteAccount(); // Assuming this function handles the API call for deletion
        alert("Account deleted successfully.");
        logoutUser();
      } catch (error) {
        alert("Failed to delete account. Please try again.",error);
      }
    }
  };




  const handleSaveProfile = async () => {
    if (!name || !email) {
      alert("Name and email cannot be empty!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    if (photo) {
      formData.append("photo", photo); 
    }

    // const BASE_URL = "http://localhost:8000";
    const BASE_URL = "https://mr-mappy-backend-node.onrender.com";

    try {
      const response = await axios.patch(
        `${BASE_URL}/api/v1/users/updateMe`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };




  // Handle the password change
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      await updateCurrentUserPassword(
        currentPassword,
        newPassword,
        confirmPassword
      );
      alert("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      logoutUser();
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please try again.");
    }
  };




  // Fetch user details when the component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getUserDetails();
        setName(response.data.user.name);
        setEmail(response.data.user.email);
        if (response.data.user.activate) {
          setStatus("Active");
        }
        setUserId(response.data.user._id);
        setphoto(response.data.photo); // Set the photo URL if available
      } catch (error) {
        throw new Error(error);
      }
    };

    const fetchActivityDetails=async()=>{
     try {
      const response= await getUserActivities()
      setActivityCount(response.data.activities.length);
      
     } catch (error) {
      throw new Error(error);
      
     }
    }

    fetchUserDetails();
    fetchActivityDetails();
  }, []);


  return (
    <>
    <NavBar2/>
    <div className="min-h-screen bg-gray-500 flex justify-center items-center px-4 py-8 sm:px-6 md:px-8">
      <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-lg w-full max-w-6xl">
        <div className="w-full lg:w-1/2 p-8 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col justify-center items-center">
          <div className="relative mb-6">
            <img
              className="w-32 h-32 rounded-full object-cover"
              src={photo ? URL.createObjectURL(photo) : "img/user.jpg"} // Preview the selected photo
              alt="User photo"
            />
          </div>
          <div className="text-center mt-4 w-full">
            <h2 className="text-2xl font-semibold mb-2">{name}</h2>
            <p className="text-lg text-gray-600 mb-4">{email}</p>
            <p className="text-lg text-gray-600 mb-4">User ID: {userId}</p>

            <p className="text-lg text-grey-800 mb-4">
              Account status: {status}
            </p>

            <div className="text-lg mb-4">
              <span className="font-medium">Activities Recorded: {actvityCount}</span>
            </div>
          </div>
          <div className="text-center mt-4 w-full">
            <Button
              variant="contained"
              color="error"
              className="w-full max-w-xs"
              onClick={handleDeleteAccount}
            >
              Deactivate Or Delete Account
            </Button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveProfile();
            }}
          >
            <div className="mb-4">
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                className="mb-4"
                size="small"
              />
            </div>
            <div className="mb-4">
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                className="mb-4"
                size="small"
              />
            </div>
            <label htmlFor="upload-photo" className="cursor-pointer">
              <div className="mb-4">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  className="w-full max-w-xs flex flex-col items-center"
                >
                  {photo ? (
                    <img
                      src={URL.createObjectURL(photo)} // Display the uploaded photo
                      alt="Uploaded Preview"
                      className="w-24 h-24 rounded-full object-cover mb-2"
                    />
                  ) : (
                    <>
                      <svg
                        className="w-8 h-8 mb-2 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 16l4-4m0 0l4 4m-4-4v12M13 4h3m0 0l3 3m-3-3v12"
                        />
                      </svg>
                      <span>Click to upload photo</span>
                      <span>JPEG only</span>
                    </>
                  )}
                  <input
                    type="file"
                    id="upload-photo"
                    accept="photo/jpeg"
                    onChange={handlephotoChange}
                    className="hidden"
                  />
                </Button>
              </div>
            </label>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="mb-6"
            >
              Save Profile
            </Button>
          </form>
        </div>
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">Change Password</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleChangePassword();
            }}
          >
            <div className="mb-4">
              <TextField
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                required
                placeholder="••••••••"
                inputProps={{ minlength: 8 }}
                size="small"
              />
            </div>
            <div className="mb-4">
              <TextField
                label="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                required
                placeholder="••••••••"
                inputProps={{ minlength: 8 }}
                size="small"
              />
            </div>
            <div className="mb-6">
              <TextField
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
                placeholder="••••••••"
                inputProps={{ minlength: 8 }}
                size="small"
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="mb-6"
            >
              Save Password
            </Button>
          </form>
        </div>
      </div>
    </div>
    <Footer/>
   </>
  );
}

export default UserAccount;
