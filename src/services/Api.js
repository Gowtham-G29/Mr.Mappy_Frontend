/* eslint-disable no-useless-catch */
import axios from 'axios';


const BASE_URL = 'https://mr-mappy-backend-node.onrender.com';

export const signup = (inputs) => {
  try {
    const response = axios.post(`${BASE_URL}/api/v1/users/signup`, {
      name: inputs.name,
      email: inputs.email,
      password: inputs.password,
      passwordConfirm: inputs.passwordConfirm
    }, { withCredentials: true })
    return response;

  } catch (error) {
    throw new Error(error);
  }


};

export const Login = async (inputs) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/users/login`,
      {
        email: inputs.email,
        password: inputs.password,
      },
      { withCredentials: true }
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

export const forgotPassword = async (inputs) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/users/forgotPassword`, {
      email: inputs.email
    }, { withCredentials: true });
    return response;
  } catch (error) {
    throw new Error(error);
  }

};

export const resetPassword = ({ token, password, passwordConfirm }) => {
  // Sending PATCH request to reset the password using the token
  return axios.patch(`${BASE_URL}/api/v1/users/resetPassword/${token}`,
    {
      password: password,
      passwordConfirm: passwordConfirm
    },
    { withCredentials: true });
};




export const deleteAccount = async () => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/v1/users/deleteMe`,
      {},
      {
        withCredentials: true, // Include cookies or other credentials
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};


export const updateProfile = async (formData) => {
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

  return response.data;
};


export const updateCurrentUserPassword = async (currentPassword, newPassword, confirmPassword) => {
  try {
    const response = await axios.patch(`${BASE_URL}/api/v1/users/updateCurrentUserPassword`, {
      passwordCurrent: currentPassword,
      password: newPassword,
      passwordConfirm: confirmPassword
    }, { withCredentials: true });

    return response.data;

  } catch (error) {

    throw error;

  }
};


export const getUserDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/users/getMe`, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    throw error;
  }
};


export const getUserActivities = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/activities/getActivity`,
      { withCredentials: true }
    );
    return response;

  } catch (error) {

    throw error;

  }
}























