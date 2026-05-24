import axiosInstance from "../interceptors/axiosInstance";

export const AuthService = {
signin: async (payload) => {
  const response = await axiosInstance.post("/api/auth/signin", payload);
  return response.data;
},

  signup(payload) {
    return axiosInstance.post("/api/auth/signup", payload);
  },

  getProfile() {
    return axiosInstance.get("/auth/me");
  },
};