import axios from "axios";
import { store } from "./store";

export const API_BASE_URL = "http://localhost:8080/api/nr-creation/v1"; // Changed to http

const api = axios.create({
  baseURL: API_BASE_URL,
});


// if (jwt) {
//   api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
// }


api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.defaults.headers.post["Content-Type"] = "application/json"; // Fixed capitalization

export default api;
