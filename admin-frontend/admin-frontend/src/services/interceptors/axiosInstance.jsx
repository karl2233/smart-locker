import axios from "axios";
import { cookieManager } from "../../shared/utils/cookie";
import { isTokenValid } from "../../shared/utils/token";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url && !config.url.startsWith("/admin")) {
      config.url = `/admin${config.url}`;
    }

    const isAuthRoute =
      config.url?.includes("/auth/signin") ||
      config.url?.includes("/auth/signup");

    if (isAuthRoute) return config;

    const token = cookieManager.get("authToken");

    if (!token) return config;

    if (!isTokenValid(token)) {
      cookieManager.remove("authToken");
      window.location.href = "/signin";
      return Promise.reject(new Error("Token expired"));
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      cookieManager.remove("authToken");
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  }
);

// ✅ EXPORT HERE
export default axiosInstance;