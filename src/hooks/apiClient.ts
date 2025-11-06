import axios from "axios";

// ساخت instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ افزودن توکن قبل از هر درخواست
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("management-ledger");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const token = parsed?.token; // ✅ فقط از token استفاده شود

          if (token) {
            config.headers = config.headers ?? {};
            (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
          } else {
            console.warn("⚠️ Token not found in localStorage:", parsed);
          }
        } catch (error) {
          console.error("❌ Invalid token format in localStorage:", error);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ مدیریت خطاها
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.warn("🚫 Unauthorized: invalid or expired token.");
      if (typeof window !== "undefined") {
        localStorage.removeItem("management-ledger");
      }
      // در صورت نیاز می‌توانی اینجا ریدایرکت به لاگین بزاری
      // window.location.href = "/login";
    }

    if (status && status >= 500) {
      console.error("💥 Server Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
