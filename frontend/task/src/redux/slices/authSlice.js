import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserApi, registerUserApi, uploadProfilePictureApi, getUserProfileApi } from "../api/authApi";
import { storeUserData, getUserFromStorage, updateProfilePictureInStorage, removeUserFromStorage } from "../utils/localStorageUtils";

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(userData);
      // Store user data in localStorage
      storeUserData({
        user: response.user,
        token: response.token,
      });
      
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);
      // Save data to localStorage
      storeUserData(response);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for uploading profile picture
/*
export const uploadProfilePicture = createAsyncThunk(
  "auth/uploadProfilePicture",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const user = auth.user;
      
      if (!user) {
        return rejectWithValue("User not authenticated");
      }
      
      const userId = user.id || user._id;
      
      if (!userId) {
        return rejectWithValue("User ID is missing");
      }

      const response = await uploadProfilePictureApi(userId, formData);
      
      // Update user data in localStorage with new profile picture
      updateProfilePictureInStorage(response.imageUrl);
      
      return response.imageUrl;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
*/
export const uploadProfilePicture = createAsyncThunk(
  "auth/uploadProfilePicture",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const user = auth.user;
      
      if (!user) {
        return rejectWithValue("User not authenticated");
      }
      
      //const userId = user.id || user._id;
      //console.log("Using userId:", userId);
      
      //if (!userId) {
        //return rejectWithValue("User ID is missing");
      //}

      //formData.append('userId', userId);
      
      const response = await uploadProfilePictureApi( formData);
      
      // Make sure this matches your backend response structure
      if (response && response.imageUrl) {
         // Update localStorage properly
  updateProfilePictureInStorage(response.imageUrl);
        return response.imageUrl;
      } else if (response && response.user && response.user.profilePicture) {
         // Update localStorage properly
  updateProfilePictureInStorage(response.user.profilePicture);
        return response.user.profilePicture;
      } else {
        return rejectWithValue("Invalid response format");
      }
    } catch (error) {
      console.error("Upload error:", error.message);
      return rejectWithValue(error.toString() || "Upload failed");
    }
  }
);
// Async thunk for getting user profile
export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await getUserProfileApi();
      return userData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Logout action
export const logoutUser = createAsyncThunk(
  "auth/logoutUser", 
  async () => {
    removeUserFromStorage();
    return null;
  }
);

// Action to manually update user in store
export const setUser = createAsyncThunk(
  "auth/setUser", 
  async (userData) => {
    // Update localStorage if needed
    storeUserData({
      user: userData
    });
    return userData;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getUserFromStorage(),
    isAuthenticated: !!getUserFromStorage(),
    isLoading: false,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    });

    // Register cases
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    });

    // Logout case
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    });

    // Profile picture upload cases
    builder.addCase(uploadProfilePicture.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(uploadProfilePicture.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.user) {
        state.user.profilePicture = action.payload;
      }
      //state.profilePicture = action.payload
      state.error = null;
    });
    builder.addCase(uploadProfilePicture.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Get User Profile cases
    builder.addCase(getUserProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      // Merge existing user data with new profile data
      state.user = { 
        ...state.user, 
        ...action.payload,
        // Ensure profilePicture is preserved if it exists in the payload
        profilePicture: action.payload.profilePicture || state.user?.profilePicture
      };
      state.error = null;
    });
    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Manual user update
    builder.addCase(setUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;