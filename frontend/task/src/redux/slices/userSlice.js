import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchUsersApi, 
  updateUserApi, 
  deleteUserApi, 
  searchUsersApi, 
  fetchUserDetailApi 
} from '../api/userApi';

// Fetch all users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUsersApi();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Update a user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, updatedData }, { rejectWithValue }) => {
    try {
      return await updateUserApi(userId, updatedData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Delete a user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await deleteUserApi(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Search users
export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async (query, { rejectWithValue }) => {
    try {
      return await searchUsersApi(query);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Get user detail
export const fetchUserDetail = createAsyncThunk(
  'users/fetchUserDetail',
  async (userId, { rejectWithValue }) => {
    try {
      return await fetchUserDetailApi(userId);
    } catch (error) {
      return rejectWithValue(error);
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