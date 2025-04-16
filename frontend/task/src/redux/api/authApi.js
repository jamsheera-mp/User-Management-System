import axios from 'axios';

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
//refresh token API call
export const refreshTokenApi = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
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
/*export const uploadProfilePictureApi = async ( formData) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw "Authentication token is missing";
    }
    
    const response = await axios.post(
      `${API_URL}/upload-profile-picture`, 
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          //"Content-Type": "multipart/form-data",
        },
      }
    );
 console.log(response.data);
 
    return response.data;

  } catch (error) {
    console.log("error while uploading profile pic:",error);
    
    throw error.response?.data || "Upload failed";
  }
};*/


// Get User Profile API call
export const getUserProfileApi = async (token) => {
  try {
    
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
/*export const updateUserProfileApi = async (userData) => {
  try {
    const token = getAuthToken();
    console.log("token received:",token);
    
    if (!token) throw "Not authenticated";

    const response = await axios.put(
      `${API_URL}/profile`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to update profile";
  }
};*/