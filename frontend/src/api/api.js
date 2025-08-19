import axios from "axios";

const API_BASE = window._env_?.REACT_APP_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const signup = (data) => api.post("/auth/signup", data);
export const signin = (data) => api.post("/auth/signin", data);
export const postTweet = (data) => api.post("/tweets", data);
export const getTweets = () => api.get("/tweets");
export const getProfile = () => api.get("/profile"); // For future use

export default api;
