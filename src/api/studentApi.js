import API from "./axiosConfig";
export const getAttendanceSummary = () =>
  API.get("/student/attendance/summary");
export const getAttendanceLog = () => API.get("/student/attendance/log");
export const getGrades = () => API.get("/student/grades");
export const getCGPATrend = () => API.get("/student/cgpa");
export const getFeeStatus = () => API.get("/student/fee");
export const getCourses = () => API.get("/student/courses");
export const getProfile = () => API.get("/student/profile");
export const updateProfile = (formData) =>
  API.put("/student/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getAssignments = () => API.get("/student/assignments");
export const payFee = (feeId, amount) =>
  API.patch(`/student/fee/${feeId}/pay`, { amount });

export const submitAssignment = (assignmentId, formData) =>
  API.post(`/student/assignments/${assignmentId}/submit`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
