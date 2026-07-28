import React, { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  UserSquare2,
  Building2,
  BookOpen,
  CreditCard,
} from "lucide-react";
import {
  getAllStudents,
  getAllTeachers,
  getAllUsers,
} from "../../api/adminApi";
import "../../styles/AdminDashboard.scss";

const QUICK_LINKS = [
  { label: "Manage Students", icon: GraduationCap, path: "/admin/students" },
  { label: "Manage Teachers", icon: UserSquare2, path: "/admin/teachers" },
  { label: "Manage Courses", icon: BookOpen, path: "/admin/courses" },
  { label: "Manage Fees", icon: CreditCard, path: "/admin/fees" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, students: 0, teachers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllUsers(), getAllStudents(), getAllTeachers()])
      .then(([usersRes, studentsRes, teachersRes]) => {
        setStats({
          users: usersRes.data.data.length,
          students: studentsRes.data.data.length,
          teachers: teachersRes.data.data.length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">University portal overview</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <Users className="admin-stat-icon" size={26} color="#64b5f6" />
          <div className="admin-stat-info">
            <span className="admin-stat-label">Total Users</span>
            <span className="admin-stat-value" style={{ color: "#64b5f6" }}>
              {stats.users}
            </span>
          </div>
        </div>
        <div className="admin-stat-card">
          <GraduationCap
            className="admin-stat-icon"
            size={26}
            color="#81c784"
          />
          <div className="admin-stat-info">
            <span className="admin-stat-label">Students</span>
            <span className="admin-stat-value" style={{ color: "#81c784" }}>
              {stats.students}
            </span>
          </div>
        </div>
        <div className="admin-stat-card">
          <UserSquare2 className="admin-stat-icon" size={26} color="#ce93d8" />
          <div className="admin-stat-info">
            <span className="admin-stat-label">Teachers</span>
            <span className="admin-stat-value" style={{ color: "#ce93d8" }}>
              {stats.teachers}
            </span>
          </div>
        </div>
        <div className="admin-stat-card">
          <Building2 className="admin-stat-icon" size={26} color="#ffb74d" />
          <div className="admin-stat-info">
            <span className="admin-stat-label">Departments</span>
            <span className="admin-stat-value" style={{ color: "#ffb74d" }}>
              6
            </span>
          </div>
        </div>
      </div>

      <div className="admin-quick-links">
        <h3 className="admin-section-title">Quick Actions</h3>
        <div className="admin-links-grid">
          {QUICK_LINKS.map((item) => (
            <a key={item.path} href={item.path} className="admin-link-card">
              <item.icon className="admin-link-icon" size={26} />
              <span className="admin-link-label">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
