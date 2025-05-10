import axios from "axios";
import { store } from "./store";
import { clearAuthState, logoutUser, setAccessToken } from "./slices/Auth/authSlice";

export const API_BASE_URL = "http://localhost:8080/api/nr-creation/v1"; // Changed to http

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // needed to send cookies (like refresh token)
});

// Request Interceptor – Attach access token
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Response Interceptor – Handle 401 and refresh token flow
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("AM I refreshing the Access-Token if it is expired");

        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = res.data.accessToken;
        store.dispatch(setAccessToken(newAccessToken));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(clearAuthState());
        // No redirect here! Let routing logic handle this
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


api.defaults.headers.post["Content-Type"] = "application/json"; // Fixed capitalization

export default api;
