import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
// Base API URL for admin endpoints
const ADMIN_API_URL = "http://localhost:5000/api/admin/users";


// Fetch all users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.accessToken;
      console.log("Fetching users with token:", token); // Debug

      if (!token) throw new Error("Not authenticated");

      const response = await axios.get(ADMIN_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetch users response:", response.data); // Debug
      return response.data;
    } catch (error) {
      console.error("Fetch users error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch users");
    }
  }
);

// Update a user
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, updatedData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.accessToken;
      console.log("Updating user with token:", token); // Debug

      if (!userId) throw new Error("User Id missing");
      if (!token) throw new Error("Not authenticated");

      const response = await axios.put(`${ADMIN_API_URL}/${userId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Update user response:", response.data); // Debug
      return response.data;
    } catch (error) {
      console.error("Update user error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      return rejectWithValue(error.response?.data?.message || error.message || "User update failed");
    }
  }
);

// Delete a user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.accessToken;
      console.log("Deleting user with token:", token); // Debug

      if (!token) throw new Error("Not authenticated");

      await axios.delete(`${ADMIN_API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Delete user success for ID:", userId); // Debug
      return userId;
    } catch (error) {
      console.error("Delete user error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      return rejectWithValue(error.response?.data?.message || error.message || "User deletion failed");
    }
  }
);

// Search users
export const searchUsers = createAsyncThunk(
  "users/searchUsers",
  async (query, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.accessToken;
      console.log("Searching users with token:", token); // Debug

      if (!token) throw new Error("Not authenticated");

      const response = await axios.get(`${ADMIN_API_URL}/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Search users response:", response.data); // Debug
      return response.data;
    } catch (error) {
      console.error("Search users error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      return rejectWithValue(error.response?.data?.message || error.message || "Search failed");
    }
  }
);

/// Get single user detail
export const fetchUserDetail = createAsyncThunk(
  "users/fetchUserDetail",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.accessToken;
      console.log("Fetching user detail with token:", token); // Debug

      if (!token) throw new Error("Not authenticated");

      const response = await axios.get(`${ADMIN_API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetch user detail response:", response.data); // Debug
      return response.data;
    } catch (error) {
      console.error("Fetch user detail error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      return rejectWithValue(error.response?.data || "Failed to fetch user details");
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    isLoading: false,
    error: null,
    currentProfile: null
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearCurrentProfile: (state) => {
      state.currentProfile = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder.addCase(fetchUsers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = action.payload;
      state.error = null;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Update User
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = state.users.map(user => 
        user._id === action.payload._id ? action.payload : user
      );
      if (state.currentProfile && state.currentProfile._id === action.payload._id) {
        state.currentProfile = action.payload;
      }
      state.error = null;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Delete User
    builder.addCase(deleteUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = state.users.filter(user => user._id !== action.payload);
      if (state.currentProfile && state.currentProfile._id === action.payload) {
        state.currentProfile = null;
      }
      state.error = null;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Search Users
    builder.addCase(searchUsers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(searchUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = action.payload;
      state.error = null;
    });
    builder.addCase(searchUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch specific user detail
    builder.addCase(fetchUserDetail.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserDetail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentProfile = action.payload;
      state.error = null;
    });
    builder.addCase(fetchUserDetail.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  }
});

export const { clearUserError, clearCurrentProfile } = userSlice.actions;
export default userSlice.reducer;