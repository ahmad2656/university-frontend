import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axiosConfig";
import "../styles/LoginPage.scss";

export default function LoginPage() {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/" />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      if (res.data.success) {
        login(res.data.user, res.data.token);
        const role = res.data.user.role;
        if (role === "student") navigate("/");
        else if (role === "teacher") navigate("/teacher/dashboard");
        else if (role === "admin") navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card login-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">
            <GraduationCap size={38} />
          </span>
          <h1 className="auth-title">UniBoard</h1>
          <p className="auth-subtitle">Student Portal — Sign in</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-form">
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

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`auth-btn ${loading ? "auth-btn-disabled" : ""}`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <p className="auth-footer">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")} className="auth-link">
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
