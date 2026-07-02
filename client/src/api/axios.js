import axios from "axios";

const STORAGE_KEY = "medisync-auth";

const getPersistedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const setPersistedToken = (token) => {
  try {
    const persisted = getPersistedState();
    if (persisted?.state) {
      persisted.state.token = token;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    }
  } catch {
    // ignore
  }
};

const clearPersistedAuth = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};

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
    const persisted = getPersistedState();
    const token = persisted?.state?.token || null;

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
        const persisted = getPersistedState();
        const refreshToken = persisted?.state?.refreshToken || null;

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

        setPersistedToken(token);

        originalRequest.headers.Authorization =
          `Bearer ${token}`;

        processQueue(null, token);

        return API(
          originalRequest
        );

      } catch (err) {

        processQueue(err, null);

        clearPersistedAuth();

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
