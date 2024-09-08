import axios from "axios";

// Use environment variable for base URL
const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});
