const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    const message = data?.error || data?.message || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
};
