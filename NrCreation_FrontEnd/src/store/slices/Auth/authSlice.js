import api from "@/store/api";
import { normalizeError } from "@/utils/normalizeError";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";


// Async thunks for login, logout and register
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', credentials);
      const { accessToken, user } = res.data.data;
      return { accessToken, user, message: res.data?.message };
    } catch (error) {
      const message = normalizeError(error);
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      console.log("User data to register : ", userData);
      
      const res = await api.post('/auth/register', userData);
      const { accessToken, user } = res.data.data;
      return { accessToken, user, message: res.data?.message };
    } catch (error) {
      const message = normalizeError(error);
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      const message = normalizeError(error);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  accessToken: null,
  user: null,
  loading: false,
  error: null,
};



// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearAuthState: (state) => {
      state.user = null;
      state.accessToken = null;
      state.loading = false;
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        toast.success(action.payload?.message);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        toast.success(action.payload?.message);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = null;
        state.user = null;
        state.error = null;
        toast.error(action.payload?.message);
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      });
  },

});

export const { setAccessToken, setUser, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
