import axios from "axios";
import { Login, SignUp } from "./types";

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: "https://db-webtech-project.onrender.com",
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const convertToURLSearchParams = (payload: { [key: string]: string }) => {
  const data = new URLSearchParams();
  for (const key in payload) {
    data.append(key, payload[key]);
  }
  return data;
};

// Function to handle login
export const login = (payload: Login) => {
  const data = convertToURLSearchParams(payload);
  return api.post("/token", data);
};

export const signup = (payload: SignUp) => {
  const data = convertToURLSearchParams(payload);
  return api.post("/signup", data);
};

export const getKgFacilities = () => {
  return api.get("/kg-facilities");
};

export const getSchoolFacilities = () => {
  return api.get("/school-facilities");
};

export const getSocialChildProjectFacilities = () => {
  return api.get("/social-child-project-facilities");
};

export const getSocialTeenageProjectFacilities = () => {
  return api.get("/social-teenage-project-facilities");
};

export const saveFavorite = (facility_id: string) => {
  const data = convertToURLSearchParams({ facility_id });
  return api.post("/users/me/favorite", data);
};

// Export the Axios instance
export default api;
