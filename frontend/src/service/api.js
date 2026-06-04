const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const request = async (path, { method = "GET", body, headers } = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(data?.error || data?.message || "Request failed");
    error.status = response.status;
    throw error;
  }

  return data;
};

const get = (path) => request(path);
const post = (path, body) => request(path, { method: "POST", body });
const put = (path, body) => request(path, { method: "PUT", body });
const del = (path) => request(path, { method: "DELETE" });

// Construit une query string en ignorant les valeurs vides (null/undefined/"").
const buildQuery = (params) => {
  if (!params) return "";
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
  return query ? `?${query}` : "";
};

// Auth
export const login = (credentials) => post("/api/auth/login", credentials);
export const register = (payload) => post("/api/auth/register", payload);
export const logout = () => post("/api/auth/logout");
export const me = () => get("/api/auth/me");
export const getRegistrationOptions = () => get("/api/auth/registration-options");
export const verifyEmail = (token) =>
  post(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
export const resendVerification = (email) => post("/api/auth/resend-verification", { email });
export const forgotPassword = (email) => post("/api/auth/forgot-password", { email });
export const resetPassword = (token, password) =>
  post("/api/auth/reset-password", { token, password });

// Classes
export const getClasses = (params) => get(`/api/classes${buildQuery(params)}`);
// Liste publique allégée (page Offres / accueil) : non paginée, mise en cache navigateur.
export const getOffers = () => get("/api/classes/offers");
export const getClassById = (classId) => get(`/api/classes/${classId}`);
export const createClass = (body) => post("/api/classes", body);
export const updateClass = (classId, body) => put(`/api/classes/${classId}`, body);
export const deleteClass = (classId) => del(`/api/classes/${classId}`);

// Courses
export const getCoursesByClass = (classId, params) => get(`/api/classes/${classId}/courses${buildQuery(params)}`);
export const getCourseById = (courseId) => get(`/api/courses/${courseId}`);
export const createCourse = (classId, body) => post(`/api/classes/${classId}/courses`, body);
export const updateCourse = (courseId, body) => put(`/api/courses/${courseId}`, body);
export const deleteCourse = (courseId) => del(`/api/courses/${courseId}`);

// Chapters
export const getChaptersByCourse = (courseId, params) => get(`/api/courses/${courseId}/chapters${buildQuery(params)}`);
export const getChapterById = (chapterId) => get(`/api/chapters/${chapterId}`);
export const createChapter = (courseId, body) => post(`/api/courses/${courseId}/chapters`, body);
export const updateChapter = (chapterId, body) => put(`/api/chapters/${chapterId}`, body);
export const deleteChapter = (chapterId) => del(`/api/chapters/${chapterId}`);

// Videos
export const getVideosByChapter = (chapterId, params) => get(`/api/chapters/${chapterId}/videos${buildQuery(params)}`);
export const getVideoById = (videoId) => get(`/api/videos/${videoId}`);
export const createVideo = (chapterId, body) => post(`/api/chapters/${chapterId}/videos`, body);
export const updateVideo = (videoId, body) => put(`/api/videos/${videoId}`, body);
export const deleteVideo = (videoId) => del(`/api/videos/${videoId}`);

// Resources (documents / PDF par chapitre)
export const getResourcesByChapter = (chapterId, params) => get(`/api/chapters/${chapterId}/resources${buildQuery(params)}`);
export const getResourceById = (resourceId) => get(`/api/resources/${resourceId}`);
export const createResource = (chapterId, body) => post(`/api/chapters/${chapterId}/resources`, body);
export const updateResource = (resourceId, body) => put(`/api/resources/${resourceId}`, body);
export const deleteResource = (resourceId) => del(`/api/resources/${resourceId}`);

// Users
export const getUsers = (params) => get(`/api/users${buildQuery(params)}`);
export const getUserById = (userId) => get(`/api/users/${userId}`);
export const createUser = (body) => post("/api/users", body);
export const updateUser = (userId, body) => put(`/api/users/${userId}`, body);
export const setUserAccess = (userId, granted) => put(`/api/users/${userId}/access`, { granted });
export const deleteUser = (userId) => del(`/api/users/${userId}`);
