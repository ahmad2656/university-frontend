import API from "./axiosConfig";

export const getAllUsers = () => API.get("/admin/users");
export const getAllStudents = () => API.get("/admin/students");
export const getAllTeachers = () => API.get("/admin/teachers");
export const createCourse = (data) => API.post("/admin/courses", data);
export const createFeeRecord = (data) => API.post("/admin/fee", data);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);