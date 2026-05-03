import { apiRequest } from "./api";

export const login = (payload) =>
  apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const register = (payload) =>
  apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const logout = () =>
  apiRequest("/api/auth/logout", {
    method: "POST",
  });

export const me = () => apiRequest("/api/auth/me");
