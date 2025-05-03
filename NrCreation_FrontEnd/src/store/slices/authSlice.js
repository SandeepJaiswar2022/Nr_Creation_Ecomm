import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/store/api";
import axios from "axios";
import { toast } from "react-toastify";

// Async thunks for login and register
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("credentials : ", credentials);

      const response = await api.post("/auth/login", credentials);

      //After Successfull login res => {msg : `success`,data : token}
      const token = response.data?.data?.token;
      const successMessage = response.data?.message;
      console.log(`My token : `, token);


      //fetching user profile after setting token
      const profileResponse = await api.get('/get-user-profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      //Fullfilled then sending Token and user profile to the state
      return { message: successMessage, token: token, userProfile: profileResponse.data?.data };

    } catch (error) {
      console.log(`Reject with value : `, error);
      return rejectWithValue(


        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { dispatch, rejectWithValue }) => {
    console.log("userData : ", userData);
    try {
      const response = await api.post("/auth/register", userData);
      if (response.data.data.token) {
        localStorage.setItem("token", response?.data?.data?.token);
      }
      const userDetails = await dispatch(fetchUserDetails());
      console.log("userDetails : ", userDetails);
      return { ...response.data, userDetails };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);

const getInitialState = () => {
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.jwtToken;
        state.user = action.payload.userProfile;
        toast.success(action.payload.message)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload?.data?.data?.token;
        state.user = action.payload.userDetails.payload.data.firstName;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })
  },
});

export const { logout, clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
