import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiChartPie,
  HiBookOpen,
  HiClipboardList,
  HiCash,
  HiClipboardCheck,
  HiMenuAlt2,
  HiX,
  HiLogout,
  HiUser,
} from "react-icons/hi";
import { PiGraduationCapDuotone } from "react-icons/pi";
import { useAuth } from "./context/AuthContext";
import "./Navbar.scss";

const STUDENT_NAV = [
  { to: "/", label: "Analytics", Icon: HiChartPie },
  { to: "/course", label: "Course", Icon: HiBookOpen },
  { to: "/assignment", label: "Assignment", Icon: HiClipboardList },
  { to: "/fee", label: "Fee", Icon: HiCash },
  { to: "/result", label: "Result", Icon: HiClipboardCheck },
  { to: "/profile", label: "Profile", Icon: HiUser },
];

const TEACHER_NAV = [
  { to: "/teacher/dashboard", label: "Dashboard", Icon: HiChartPie },
  { to: "/teacher/courses", label: "My Courses", Icon: HiBookOpen },
  { to: "/teacher/attendance", label: "Attendance", Icon: HiClipboardList },
  { to: "/teacher/grades", label: "Grades", Icon: HiClipboardCheck },
  { to: "/teacher/assignments", label: "Assignments", Icon: HiClipboardList },
];

const ADMIN_NAV = [
  { to: "/admin/dashboard", label: "Dashboard", Icon: HiChartPie },
  { to: "/admin/students", label: "Students", Icon: HiUser },
  { to: "/admin/teachers", label: "Teachers", Icon: HiUser },
  { to: "/admin/courses", label: "Courses", Icon: HiBookOpen },
  { to: "/admin/fees", label: "Fees", Icon: HiCash },
];

const Navbar = () => {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Toggle navbar on mobile
  const toggleNav = () => {
    setOpen((prev) => !prev);
  };

  // Close navbar on mobile when link is clicked
  const closeNav = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  const role = user?.role || "student";
  const NAV_ITEMS =
    role === "teacher"
      ? TEACHER_NAV
      : role === "admin"
        ? ADMIN_NAV
        : STUDENT_NAV;

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="nb-mobile-btn"
        onClick={toggleNav}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <HiX /> : <HiMenuAlt2 />}
      </button>

      {/* Overlay */}
      <div
        className={`nb-overlay ${open && isMobile ? "nb-overlay-show" : ""}`}
        onClick={closeNav}
      />

      <aside className={`nb-aside ${open ? "nb-open" : "nb-closed"}`}>
        <div className="nb-top">
          <div className="nb-brand">
            <PiGraduationCapDuotone className="nb-brand-icon" />
            {open && (
              <div className="nb-brand-text">
                <span className="nb-brand-title">UniBoard</span>
                <span className="nb-brand-sub">
                  {role === "teacher"
                    ? "Teacher Portal"
                    : role === "admin"
                      ? "Admin Portal"
                      : "Student Portal"}
                </span>
              </div>
            )}
          </div>
          <button
            className="nb-hamburger"
            onClick={toggleNav}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <HiX /> : <HiMenuAlt2 />}
          </button>
        </div>

        <div className="nb-divider" />

        <nav>
          <ul className="nb-list">
            {NAV_ITEMS.map(({ to, label, Icon }) => {
              const active = location.pathname === to;
              return (
                <li key={to} className="nb-item">
                  <Link
                    to={to}
                    className={`nb-link ${active ? "nb-active" : ""}`}
                    onClick={closeNav}
                  >
                    <span className="nb-icon-wrap">
                      <Icon className="nb-icon" />
                      {!open && <span className="nb-tooltip">{label}</span>}
                    </span>
                    {open && <span className="nb-label">{label}</span>}
                    {open && active && <span className="nb-pip" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="nb-bottom">
          {open && user && (
            <div className="nb-user-info">
              <span className="nb-user-email">{user.email}</span>
              <span className="nb-user-role">{user.role}</span>
            </div>
          )}
          <button className="nb-logout" onClick={handleLogout}>
            <HiLogout className="nb-icon" />
            {open && <span>Logout</span>}
          </button>
        </div>

        {open && (
          <div className="nb-footer">
            <span className="nb-footer-dot" />
            <span className="nb-footer-text">Spring 2025</span>
          </div>
        )}
      </aside>
    </>
  );
};

export default Navbar;
