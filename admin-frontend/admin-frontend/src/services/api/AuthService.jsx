import axiosInstance from "../interceptors/axiosInstance";

export const AuthService = {
  signin(payload) {
    return axiosInstance.post("/api/auth/signin", payload);
  },

  signup(payload) {
    return axiosInstance.post("/api/auth/signup", payload);
  },

  getProfile() {
    return axiosInstance.get("/auth/me");
  },
};