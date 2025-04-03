import axios from 'axios';
import { getAuthToken } from '../utils/tokenUtils';

// Base API URL
const API_URL = "http://localhost:5000/api/users";

// Login API call
export const loginUserApi = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Login Failed";
  }
};

// Registration API call
export const registerUserApi = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

// Upload Profile Picture API call
export const uploadProfilePictureApi = async (userId, formData) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw "Authentication token is missing";
    }
    

    //  userId is a string before using it in the URL
    const stringUserId = typeof userId === 'object' ? 
      (userId.id || userId.toString()) : userId.toString();


    const response = await axios.post(
      `${API_URL}/${stringUserId}/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || "Upload failed";
  }
};

// Get User Profile API call
export const getUserProfileApi = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw "Not authenticated";

    const response = await axios.get(
      `${API_URL}/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch profile";
  }
};