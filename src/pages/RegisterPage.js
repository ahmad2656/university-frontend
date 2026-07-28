import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, UserSquare2, ShieldCheck } from "lucide-react";
import API from "../api/axiosConfig";
import "../styles/RegisterPage.scss";

const DEPARTMENTS = [
  "Computer Science",
  "Business",
  "Engineering",
  "Medicine",
  "Arts",
  "Law",
];

const DESIGNATIONS = [
  "Lecturer",
  "Assistant Professor",
  "Associate Professor",
  "Professor",
];

const ROLE_ICONS = {
  student: GraduationCap,
  teacher: UserSquare2,
  admin: ShieldCheck,
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "student",
    full_name: "",
    roll_number: "",
    employee_id: "",
    department: "Computer Science",
    semester: 1,
    designation: "Lecturer",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      if (res.data.success) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">
            <GraduationCap size={38} />
          </span>
          <h1 className="auth-title">UniBoard</h1>
          <p className="auth-subtitle">Create your account</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <div className="auth-form">
          <div className="role-selector">
            {["student", "teacher", "admin"].map((r) => {
              const RoleIcon = ROLE_ICONS[r];
              return (
                <button
                  key={r}
                  type="button"
                  className={`role-btn ${form.role === r ? "role-btn-active" : ""}`}
                  onClick={() => setForm({ ...form, role: r })}
                >
                  <RoleIcon size={20} />
                  <span>{r.charAt(0).toUpperCase() + r.slice(1)}</span>
                </button>
              );
            })}
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Ali Khan"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ali@university.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          {form.role === "student" && (
            <>
              <div className="form-group">
                <label className="form-label">Roll Number</label>
                <input
                  name="roll_number"
                  value={form.roll_number}
                  onChange={handleChange}
                  placeholder="CS-2021-01"
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="form-input form-select"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <select
                    name="semester"
                    value={form.semester}
                    onChange={handleChange}
                    className="form-input form-select"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {form.role === "teacher" && (
            <>
              <div className="form-group">
                <label className="form-label">Employee ID</label>
                <input
                  name="employee_id"
                  value={form.employee_id}
                  onChange={handleChange}
                  placeholder="EMP-001"
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="form-input form-select"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <select
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    className="form-input form-select"
                  >
                    {DESIGNATIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {form.role === "admin" && (
            <div className="admin-info-box">
              <ShieldCheck size={20} />
              <p>Admin account sirf authorized personnel ke liye hai.</p>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Phone (optional)</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="03001234567"
              className="form-input"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`auth-btn ${loading ? "auth-btn-disabled" : ""}`}
          >
            {loading
              ? "Creating account..."
              : `Register as ${form.role.charAt(0).toUpperCase() + form.role.slice(1)}`}
          </button>
        </div>

        <p className="auth-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="auth-link">
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}
