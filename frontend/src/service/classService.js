import { apiRequest } from "./api";

export const getClasses = () => apiRequest("/api/classes");

export const getClassById = (classId) => apiRequest(`/api/classes/${classId}`);

export const getCoursesByClass = (classId) => apiRequest(`/api/classes/${classId}/courses`);

export const getCourseById = (courseId) => apiRequest(`/api/courses/${courseId}`);

export const getChaptersByCourse = (courseId) => apiRequest(`/api/courses/${courseId}/chapters`);

export const getChapterById = (chapterId) => apiRequest(`/api/chapters/${chapterId}`);

export const getVideosByChapter = (chapterId) => apiRequest(`/api/chapters/${chapterId}/videos`);

export const getVideoById = (videoId) => apiRequest(`/api/videos/${videoId}`);