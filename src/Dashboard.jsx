import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import "./Dashboard.css";
import Analytics from "./Analytics";
import CoursesPage from "./pages/student/CoursesPage";
import AttendancePage from "./pages/student/AttendancePage";
import AssignmentPage from "./pages/student/AssignmentPage";
import FeePage from "./pages/student/FeePage";
import ResultPage from "./pages/student/ResultPage";
import ProfilePage from "./pages/student/ProfilePage";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherCoursesPage from "./pages/teacher/TeacherCoursesPage";
import TeacherAttendancePage from "./pages/teacher/TeacherAttendancePage";
import TeacherGradesPage from "./pages/teacher/TeacherGradesPage";
import TeacherAssignmentsPage from "./pages/teacher/TeacherAssignmentsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudentsPage from "./pages/admin/AdminStudentsPage";
import AdminTeachersPage from "./pages/admin/AdminTeachersPage";
import AdminCoursesPage from "./pages/admin/AdminCoursesPage";
import AdminFeesPage from "./pages/admin/AdminFeesPage";
import AIAgent from "./components/widgets/AIAgent";

const Dashboard = () => {
  return (
    <div className="main-dasboard-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <section className="parent-analytics">
                <Analytics />
              </section>
            }
          />
          <Route
            path="/course"
            element={
              <section className="parent-analytics">
                <CoursesPage />
              </section>
            }
          />
          <Route
            path="/attendance"
            element={
              <section className="parent-analytics">
                <AttendancePage />
              </section>
            }
          />
          <Route
            path="/assignment"
            element={
              <section className="parent-analytics">
                <AssignmentPage />
              </section>
            }
          />
          <Route
            path="/fee"
            element={
              <section className="parent-analytics">
                <FeePage />
              </section>
            }
          />
          <Route
            path="/result"
            element={
              <section className="parent-analytics">
                <ResultPage />
              </section>
            }
          />
          <Route
            path="/profile"
            element={
              <section className="parent-analytics">
                <ProfilePage />
              </section>
            }
          />
          <Route
            path="/teacher/dashboard"
            element={
              <section className="parent-analytics">
                <TeacherDashboard />
              </section>
            }
          />
          <Route
            path="/teacher/courses"
            element={
              <section className="parent-analytics">
                <TeacherCoursesPage />
              </section>
            }
          />
          <Route
            path="/teacher/attendance"
            element={
              <section className="parent-analytics">
                <TeacherAttendancePage />
              </section>
            }
          />
          <Route
            path="/teacher/grades"
            element={
              <section className="parent-analytics">
                <TeacherGradesPage />
              </section>
            }
          />
          <Route
            path="/teacher/assignments"
            element={
              <section className="parent-analytics">
                <TeacherAssignmentsPage />
              </section>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <section className="parent-analytics">
                <AdminDashboard />
              </section>
            }
          />
          <Route
            path="/admin/students"
            element={
              <section className="parent-analytics">
                <AdminStudentsPage />
              </section>
            }
          />
          <Route
            path="/admin/teachers"
            element={
              <section className="parent-analytics">
                <AdminTeachersPage />
              </section>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <section className="parent-analytics">
                <AdminCoursesPage />
              </section>
            }
          />
          <Route
            path="/admin/fees"
            element={
              <section className="parent-analytics">
                <AdminFeesPage />
              </section>
            }
          />
        </Routes>
      </main>
        <AIAgent />
    </div>
  );
};

export default Dashboard;
