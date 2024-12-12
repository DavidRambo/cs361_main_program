import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // sets URL in .env variable
});

api.interceptors.request.use(
  (config) => {
    // Look in local storage for access token. If found, add it to authorization header.
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const csv_api = axios.create({
  baseURL: "http://localhost:3000/",
});

export const text_api = axios.create({
  baseURL: "http://localhost:8001/",
});

export default api;
