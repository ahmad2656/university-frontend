import React, { useEffect, useState } from "react";
import { getAllStudents, createFeeRecord } from "../../api/adminApi";
import feeevector from "../../assets/png/payment.png";

import "../../styles/AdminFeesPage.scss";

export default function AdminFeesPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    student_id: "",
    semester: 1,
    total_amount: "",
    due_date: "",
  });

  useEffect(() => {
    getAllStudents()
      .then((res) => setStudents(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      await createFeeRecord(form);
      setSuccess("Fee record created successfully!");
      setForm({ student_id: "", semester: 1, total_amount: "", due_date: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create fee record");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-loader">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-layout">
          <div>
            <h1 className="page-title">Fee Management</h1>
            <p className="page-subtitle">
              Create and manage student fee records
            </p>
          </div>
          <img
            src={feeevector}
            className="vector-imges"
            id="fee-vector"
            alt=""
          />
        </div>
      </div>

      {success && <div className="ta-success">{success}</div>}
      {error && <div className="ta-error">{error}</div>}

      <div className="af-form-card">
        <h3 className="ac-form-title">Create Fee Record</h3>
        <div className="af-form-grid">
          <div className="ta-control-group">
            <label className="ta-label">Select Student</label>
            <select
              name="student_id"
              value={form.student_id}
              onChange={handleChange}
              className="ta-select"
            >
              <option value="">-- Select Student --</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.full_name} — {s.roll_number}
                </option>
              ))}
            </select>
          </div>

          <div className="ta-control-group">
            <label className="ta-label">Semester</label>
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              className="ta-select"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          <div className="ta-control-group">
            <label className="ta-label">Total Amount (Rs)</label>
            <input
              name="total_amount"
              type="number"
              value={form.total_amount}
              onChange={handleChange}
              placeholder="250000"
              className="ta-select"
            />
          </div>

          <div className="ta-control-group">
            <label className="ta-label">Due Date</label>
            <input
              name="due_date"
              type="date"
              value={form.due_date}
              onChange={handleChange}
              className="ta-select"
            />
          </div>
        </div>

        <button
          className="ta-submit-btn"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Fee Record"}
        </button>
      </div>
    </div>
  );
}
