import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/store/api";

// Async thunk to fetch customer details
export const fetchUserDetails = createAsyncThunk(
  "auth/fetchUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/get-user-profile");
      console.log("response : ", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch User details" }
      );
    }
  }
);

// Async thunks for login and register
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      //   console.log("credentials : ", credentials);

      const response = await api.post("/auth/login", credentials);
      // Store token in localStorage
      //   console.log("response : ", response.data.data.token);
      const userDetails = await dispatch(fetchUserDetails());
      // console.log("userDetails : ", userDetails);
      if (response.data.data.token && userDetails) {
        localStorage.setItem("token", response.data.data.token);
      }
      // After successful login, fetch User details
      return { ...response.data, userDetails };
    } catch (error) {
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

// Get initial state from localStorage
const getInitialState = () => {
  const token = localStorage.getItem("token");
  return {
    user: null,
    token,
    isAuthenticated: !!token,
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
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
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
        state.token = action.payload.token;
        state.user = action.payload.userDetails.payload.data.firstName;
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
      // Customer details cases
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch customer details";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
