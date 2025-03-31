import axios from "axios";

export const API_BASE_URL = "http://localhost:8080/api/nr-creation/v1"; // Changed to http

const api = axios.create({
  baseURL: API_BASE_URL,
});

const jwt = localStorage.getItem("token");

if (jwt) {
  api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}

api.defaults.headers.post["Content-Type"] = "application/json"; // Fixed capitalization

export default api;
