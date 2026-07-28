import API from "./axiosConfig";

export const getTeacherProfile = () => API.get("/teacher/profile");
export const getTeacherCourses = () => API.get("/teacher/courses");
export const getStudentsByCourse = (courseId) => API.get(`/teacher/courses/${courseId}/students`);
export const markAttendance = (data) => API.post("/teacher/attendance", data);
export const addGrade = (data) => API.post("/teacher/grades", data);
export const createAssignment = (data) => API.post("/teacher/assignments", data);
export const getTeacherAssignments = () => API.get("/teacher/assignments");