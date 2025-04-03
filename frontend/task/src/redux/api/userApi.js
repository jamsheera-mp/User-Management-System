import axios from 'axios';
import { getAuthToken } from '../utils/tokenUtils';

// Base API URL for admin endpoints
const ADMIN_API_URL = "http://localhost:5000/api/admin/users";

// Fetch all users API call
export const fetchUsersApi = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw "Not authenticated";

    const response = await axios.get(ADMIN_API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch users";
  }
};

// Update user API call
export const updateUserApi = async (userId, updatedData) => {
  try {
    if (!userId) {
      throw "User Id missing";
    }
    
    const token = getAuthToken();
    if (!token) throw "Not authenticated";
    
    const response = await axios.put(`${ADMIN_API_URL}/${userId}`, updatedData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "User update failed";
  }
};

// Delete user API call
export const deleteUserApi = async (userId) => {
  try {
    const token = getAuthToken();
    if (!token) throw "Not authenticated";

    await axios.delete(`${ADMIN_API_URL}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return userId;
  } catch (error) {
    throw error.response?.data;
  }
};

// Search users API call
export const searchUsersApi = async (query) => {
  try {
    const token = getAuthToken();
    if (!token) throw "Not authenticated";
    
    const response = await axios.get(`${ADMIN_API_URL}/search?query=${query}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Search failed";
  }
};

// Get single user detail API call
export const fetchUserDetailApi = async (userId) => {
  try {
    const token = getAuthToken();
    if (!token) throw "Not authenticated";

    const response = await axios.get(`${ADMIN_API_URL}/${userId}`, {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch user details";
  }
};