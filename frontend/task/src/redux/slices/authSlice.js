import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//import { loginUserApi, registerUserApi, uploadProfilePictureApi, getUserProfileApi, updateUserProfileApi } from "../api/authApi";

//import axios from 'axios'
import axiosInstance from "../utils/axiosConfig";

const API_URL = "http://localhost:5000/api/users";
// Async thunks

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/login`, credentials);
      return response.data; // { message, user, accessToken, refreshToken }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (refreshToken, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/refresh-token`, { refreshToken });
      return response.data; //  { accessToken }
    } catch (error) {
      console.error("Refresh token error:", error);
      return rejectWithValue(error.response?.data?.message || "Refresh failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/register`, userData);
      console.log("Register user response:", response.data); 
      return response.data; // { message, user }
    } catch (error) {
      console.error("Register user error:", error);
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);



export const uploadProfilePicture = createAsyncThunk(
  "auth/uploadProfilePicture",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.accessToken;
      console.log("Token from state:", token); 

      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const response = await axiosInstance.post(
        `${API_URL}/upload-profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            
          },
        }
      );
      console.log("Upload response:", response.data);

      // Extract the profile picture URL from the response
      return (
        response.data.imageUrl ||
        response.data.user?.profilePicture ||
        response.data.profilePicture ||
        null //  if no URL is found
      );
    } catch (error) {
      console.error("Error while uploading profile picture:", error);
      return rejectWithValue(error.response?.data || "Upload failed");
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.accessToken;
      console.log("Fetching user profile with token:", token); 

      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const response = await axiosInstance.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Get user profile response:", response.data); 
      return response.data.user; //  API returns { user: {...} }
    } catch (error) {
      console.error("Get user profile error:", error);
      return rejectWithValue(error.response?.data || "Profile fetch failed");
    }
  }
);


export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.accessToken;
      console.log("Token from state:", token); 

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await axiosInstance.put(
        `${API_URL}/profile`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API response:", response.data); 
      return response.data;
    } catch (error) {
      console.error("API error:", error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload?.message;
    });
    //refresh token
    builder.addCase(refreshAccessToken.fulfilled, (state, action) => {
      state.isLoading = false;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(refreshAccessToken.rejected, (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("refreshToken");
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload?.message||action.payload;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
      localStorage.removeItem("refreshToken")
    });

    // Upload Profile Picture
    builder.addCase(uploadProfilePicture.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(uploadProfilePicture.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.user) state.user.profilePicture = action.payload;
    });
    builder.addCase(uploadProfilePicture.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Get User Profile
    builder.addCase(getUserProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = { ...state.user, ...action.payload };
    });
    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Update User Profile
    builder.addCase(updateUserProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      console.log("state user updated to:",state.user);
      
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
