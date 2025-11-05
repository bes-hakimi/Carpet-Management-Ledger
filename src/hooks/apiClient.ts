import axios from "axios";

// ساخت instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// اضافه کردن توکن قبل از ارسال هر درخواست
apiClient.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// مدیریت پاسخ‌ها و خطاها
apiClient.interceptors.response.use(
  (response) => response, // برگشت کل response
  async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      console.warn("Session expired. Redirecting to login...");
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    if (status && status >= 500) {
      console.error("Server Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
