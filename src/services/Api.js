import axios from 'axios';

// Replace Firebase URLs with your Node.js backend URLs
const BASE_URL = 'http://localhost:5000';

export const RegisterApi = (inputs) => {
  return axios.post(`${BASE_URL}/register`, {
    name: inputs.name,
    email: inputs.email,
    password: inputs.password,
  });
};

export const LoginApi = (inputs) => {
  return axios.post(`${BASE_URL}/login`, {
    email: inputs.email,
    password: inputs.password,
  });
};

export const userDetailsApi = (token) => {
  return axios.post(`${BASE_URL}/user-details`, {
    token: token,
  });
};



export const getUserDetails = async (token) => {
  try {
    const response = await axios.post('http://localhost:5000/user-details', {
      token: token,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error.response?.data || error.message);
    return null;
  }
};









