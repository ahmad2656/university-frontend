import React, { useEffect, useState } from "react";
import { FileText, Image as ImageIcon, Paperclip } from "lucide-react";
import { getAssignments } from "../../api/studentApi";
import assignmentvector from "../../assets/png/assignment.png";
import API from "../../api/axiosConfig";
import "../../styles/AssignmentPage.scss";

export default function AssignmentPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeSubmit, setActiveSubmit] = useState(null);
  const [submitForm, setSubmitForm] = useState({ message: "", files: [] });

  useEffect(() => {
    getAssignments()
      .then((res) => setAssignments(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setSubmitForm((prev) => ({ ...prev, files: selected }));
  };

  const handleSubmit = async (assignmentId) => {
    setSubmitting(assignmentId);
    setError("");
    try {
      const formData = new FormData();
      if (submitForm.message) formData.append("message", submitForm.message);
      submitForm.files.forEach((file) => formData.append("files", file));

      await API.post(`/student/assignments/${assignmentId}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAssignments((prev) =>
        prev.map((a) =>
          a._id === assignmentId
            ? {
                ...a,
                mySubmission: {
                  submitted_at: new Date(),
                  status:
                    new Date() > new Date(a.due_date) ? "late" : "submitted",
                  message: submitForm.message,
                  files: submitForm.files.map((f) => ({ name: f.name })),
                },
              }
            : a,
        ),
      );
      setSuccess("Assignment submitted successfully!");
      setActiveSubmit(null);
      setSubmitForm({ message: "", files: [] });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
      setTimeout(() => setError(""), 3000);
    } finally {
      setSubmitting(null);
    }
  };

  const getDaysLeft = (due_date) => {
    const diff = new Date(due_date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0)
      return { text: `${Math.abs(days)} days overdue`, color: "#ef5350" };
    if (days === 0) return { text: "Due today", color: "#ffb74d" };
    if (days <= 3) return { text: `${days} days left`, color: "#ffb74d" };
    return { text: `${days} days left`, color: "#81c784" };
  };

  if (loading) return <div className="page-loader">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-layout">
          <div>
            <h1 className="headings">Assignments</h1>
            <p className="page-subtitle">Current semester assignments</p>
          </div>

          <div>
            <img
              src={assignmentvector}
              className="vector-imges"
              id="assignment-vector"
              alt=""
            />
          </div>
        </div>
      </div>

      {success && <div className="assign-success">{success}</div>}
      {error && <div className="assign-error">{error}</div>}

      <div className="assignment-list">
        {assignments.map((a) => {
          const submission = a.mySubmission;
          const isSubmitted = !!submission;
          const isLate = submission?.status === "late";
          const { text: dayText, color: dayColor } = getDaysLeft(a.due_date);
          const isActive = activeSubmit === a._id;

          return (
            <div key={a._id} className="assignment-card">
              <div className="assignment-top">
                <div className="assignment-left">
                  <FileText className="assignment-icon" size={24} />
                  <div>
                    <h3 className="assignment-title">{a.title}</h3>
                    {a.description && (
                      <p className="assignment-desc">{a.description}</p>
                    )}
                    <p className="assignment-subject">
                      {a.course_id?.course_name} • {a.course_id?.course_code}
                    </p>
                    <p className="assignment-due">
                      Due: {new Date(a.due_date).toLocaleDateString()} —{" "}
                      <span style={{ color: dayColor }}>{dayText}</span>
                    </p>
                    <p className="assignment-marks">
                      Total Marks: {a.total_marks}
                    </p>
                  </div>
                </div>

                <span
                  className="assignment-status"
                  style={
                    isSubmitted
                      ? isLate
                        ? {
                            color: "#ffb74d",
                            background: "#ffb74d22",
                            border: "1px solid #ffb74d44",
                          }
                        : {
                            color: "#81c784",
                            background: "#81c78422",
                            border: "1px solid #81c78444",
                          }
                      : new Date() > new Date(a.due_date)
                        ? {
                            color: "#ef5350",
                            background: "#ef535022",
                            border: "1px solid #ef535044",
                          }
                        : {
                            color: "#ffb74d",
                            background: "#ffb74d22",
                            border: "1px solid #ffb74d44",
                          }
                  }
                >
                  {isSubmitted
                    ? isLate
                      ? "Late Submitted"
                      : "Submitted"
                    : new Date() > new Date(a.due_date)
                      ? "Overdue"
                      : "Pending"}
                </span>
              </div>

              {isSubmitted && (
                <div className="submission-info">
                  <div className="submission-info-row">
                    <span className="submission-info-label">Submitted at:</span>
                    <span className="submission-info-value">
                      {new Date(submission.submitted_at).toLocaleString()}
                    </span>
                  </div>
                  {submission.message && (
                    <div className="submission-info-row">
                      <span className="submission-info-label">Message:</span>
                      <span className="submission-info-value">
                        {submission.message}
                      </span>
                    </div>
                  )}
                  {submission.files && submission.files.length > 0 && (
                    <div className="submission-files">
                      <span className="submission-info-label">Files:</span>
                      <div className="submission-file-list">
                        {submission.files.map((f, i) => (
                          <span key={i} className="submission-file-badge">
                            {f.type === "pdf" ? (
                              <FileText size={13} />
                            ) : (
                              <ImageIcon size={13} />
                            )}
                            {f.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!isSubmitted && (
                <>
                  {!isActive ? (
                    <div className="assignment-actions">
                      <button
                        className="assignment-submit-btn"
                        onClick={() => setActiveSubmit(a._id)}
                      >
                        Submit Assignment
                      </button>
                    </div>
                  ) : (
                    <div className="submit-form">
                      <div className="submit-form-group">
                        <label className="submit-label">
                          Message for teacher (optional)
                        </label>
                        <textarea
                          className="submit-textarea"
                          placeholder="Koi note ya message..."
                          value={submitForm.message}
                          onChange={(e) =>
                            setSubmitForm({
                              ...submitForm,
                              message: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>

                      <div className="submit-form-group">
                        <label className="submit-label">
                          Attach Files — PDF, Word, Excel, PowerPoint ya Image
                        </label>
                        <label className="submit-file-label">
                          <Paperclip size={14} />
                          {submitForm.files.length > 0
                            ? submitForm.files.map((f) => f.name).join(", ")
                            : "File choose karo"}
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*"
                            multiple
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                        </label>
                        {submitForm.files.length > 0 && (
                          <div className="selected-files">
                            {submitForm.files.map((f, i) => (
                              <span key={i} className="selected-file-badge">
                                {f.name.endsWith(".pdf") ? (
                                  <FileText size={12} />
                                ) : (
                                  <ImageIcon size={12} />
                                )}
                                {f.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="submit-form-actions">
                        <button
                          className="submit-cancel-btn"
                          onClick={() => {
                            setActiveSubmit(null);
                            setSubmitForm({ message: "", files: [] });
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="assignment-submit-btn"
                          onClick={() => handleSubmit(a._id)}
                          disabled={submitting === a._id}
                        >
                          {submitting === a._id
                            ? "Submitting..."
                            : "Confirm Submit"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        {assignments.length === 0 && (
          <div className="empty-state">No assignments found</div>
        )}
      </div>
    </div>
  );
}
