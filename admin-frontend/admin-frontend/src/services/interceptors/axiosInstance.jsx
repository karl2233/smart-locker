import axios from "axios";
import { cookieManager } from "../../shared/utils/cookie";
import { isTokenValid } from "../../shared/utils/token";

/**
 * Resolution order for the API base URL:
 *
 *   1. window.__APP_CONFIG__.API_BASE_URL — written into /config.js by the
 *      container at start-up. This is what dev/test/prod use, and it is why
 *      one image can serve all three stages.
 *   2. import.meta.env.VITE_API_BASE_URL — `npm run dev` and Vitest, where no
 *      container is involved.
 *   3. "" — same origin, for the nginx reverse-proxy setup.
 */
const runtimeConfig =
  typeof window !== "undefined" ? window.__APP_CONFIG__ ?? {} : {};

const baseURL =
  runtimeConfig.API_BASE_URL ?? import.meta.env.VITE_API_BASE_URL ?? "";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Prefix /admin automatically
    if (config.url && !config.url.startsWith("/admin")) {
      config.url = `/admin${config.url}`;
    }

    // Public auth routes
    const isAuthRoute =
      config.url?.includes("/auth/signin") ||
      config.url?.includes("/auth/signup");

    if (isAuthRoute) {
      return config;
    }

    const token = cookieManager.get("authToken");

    // No token
    if (!token) {
      return config;
    }

    // Expired token
    if (!isTokenValid(token)) {
      cookieManager.remove("authToken");
      window.location.href = "/signin";

      return Promise.reject(new Error("Token expired"));
    }

    // Attach token
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    const isAuthRoute =
      url?.includes("/auth/signin") || url?.includes("/auth/signup");

    // Redirect only for protected routes
    if (status === 401 && !isAuthRoute) {
      cookieManager.remove("authToken");
      window.location.href = "/signin";
    }

    // IMPORTANT: rethrow error
    return Promise.reject(error);
  }
);

export default axiosInstance;