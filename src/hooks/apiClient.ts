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

// مدیریت پاسخ‌ها و خطاها
apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url;
    const method = error?.config?.method;

    console.error("❌ API Error:", {
      url,
      method,
      status,
      message: error.message,
      data: error?.response?.data,
    });

    if (status === 401 && typeof window !== "undefined") {
      console.warn("🚫 Unauthorized: invalid or expired token.");
      localStorage.removeItem("management-ledger");
      // window.location.href = "/login"; // در صورت نیاز ریدایرکت
    }

    if (status && status >= 500) {
      console.error("💥 Server Error:", error.message);
    }

    return Promise.reject(error);
  }
);


export default apiClient;
