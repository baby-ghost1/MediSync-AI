import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  timeout: 30000,

  headers: {
    "Content-Type":
      "application/json",
  },

  withCredentials: true,
});

const REFRESH_URL =
  `${
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api"
  }/auth/refresh-token`;

/* =====================================
      Request Interceptor
==================================== */

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

/* =====================================
      Response Interceptor
==================================== */

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;

    if (
      error.response?.status ===
        401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken =
          localStorage.getItem(
            "refreshToken"
          );

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response =
          await axios.post(
            REFRESH_URL,
            {
              refreshToken,
            },
            { withCredentials: true }
          );

        const {
          token,
        } = response.data?.data || response.data;

        if (!token) {
          throw new Error("No token in refresh response");
        }

        localStorage.setItem(
          "token",
          token
        );

        originalRequest.headers.Authorization =
          `Bearer ${token}`;

        processQueue(null, token);

        return API(
          originalRequest
        );

      } catch (err) {

        processQueue(err, null);

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "refreshToken"
        );

        if (
          window.location.pathname !==
          "/login"
        ) {
          window.location.href =
            "/login";
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
