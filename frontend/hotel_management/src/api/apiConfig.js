const BASE_URL = "http://localhost:8083/api";
const TIMEOUT = 5000;

const fetchWithTimeout = (url, options = {}, timeout = TIMEOUT) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    ),
  ]);
};

const request = async (endpoint, method = "GET", data = null) => {
  const token = localStorage.getItem("token");

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  if (data) config.body = JSON.stringify(data);

  try {
    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, config);

    const text = await response.text();
    let json;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = { message: text };
    }

    if (!response.ok) {
      if (response.status === 401) {
        console.error("401 Unauthorized: Token hết hạn hoặc không hợp lệ.");
        localStorage.removeItem("token");

      } else if (response.status === 403) {
        console.error("403 Forbidden: Không có quyền truy cập.");
      } else if (response.status >= 500) {
        console.error("Lỗi server:", json);
      }
      throw json;
    }

    return json; 

  } catch (error) {
    const msg = typeof error?.message === "string" ? error.message : "";
    if (msg === "Request timeout") {
      console.error("⏱️ Timeout: Server did not respond.");
    } else if (msg.includes("Failed to fetch")) {
      console.error("🌐 Network Error: Cannot connect to server.");
    } else {
      console.error("❌ Request error:", error);
    }
    throw error;
  }
};

export const api = {
  get: (endpoint) => request(endpoint, "GET"),
  post: (endpoint, data) => request(endpoint, "POST", data),
  put: (endpoint, data) => request(endpoint, "PUT", data),
  patch: (endpoint, data) => request(endpoint, "PATCH", data),
  delete: (endpoint) => request(endpoint, "DELETE"),
};

export default api;
