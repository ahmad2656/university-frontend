import React, { useEffect, useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Paperclip,
  X,
  Download,
  ExternalLink,
  BookOpen,
  ClipboardList,
  Calendar,
  BarChart3,
  ChevronDown,
  Inbox,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlarmClock,
  Hourglass,
  Rocket,
} from "lucide-react";
import {
  getTeacherCourses,
  createAssignment,
  getTeacherAssignments,
} from "../../api/teacherApi";
import "../../styles/TeacherAssignmentsPage.scss";
import studentvectorimg from "../../assets/png/assignment.png";

const FILE_SERVER_URL = "http://localhost:5000";

function FileIcon({ name, size = 16 }) {
  const ext = name?.split(".").pop()?.toLowerCase() || "";
  const imageExts = ["jpg", "jpeg", "png", "gif", "svg"];
  if (ext === "pdf") return <FileText size={size} />;
  if (imageExts.includes(ext)) return <ImageIcon size={size} />;
  return <Paperclip size={size} />;
}

function StatusIcon({ status, size = 14 }) {
  if (status === "submitted") return <CheckCircle2 size={size} />;
  if (status === "late") return <AlarmClock size={size} />;
  return <Hourglass size={size} />;
}

export default function TeacherAssignmentsPage() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    course_id: "",
    due_date: "",
    total_marks: 100,
  });

  useEffect(() => {
    Promise.all([getTeacherCourses(), getTeacherAssignments()])
      .then(([coursesRes, assignmentsRes]) => {
        setCourses(coursesRes.data.data);
        setAssignments(assignmentsRes.data.data);
      })
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
      const res = await createAssignment(form);
      setAssignments((prev) => [res.data.data, ...prev]);
      setSuccess("Assignment created successfully!");
      setForm({
        title: "",
        description: "",
        course_id: "",
        due_date: "",
        total_marks: 100,
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const getSubmissionColor = (status) => {
    if (status === "submitted") return "#81c784";
    if (status === "late") return "#ffb74d";
    return "#9a8fa3";
  };

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
    setSelectedFile(null);
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  const closeFileViewer = () => {
    setSelectedFile(null);
  };

  const getFileTypeColor = (fileName) => {
    const ext = fileName?.split(".").pop()?.toLowerCase() || "";
    const colors = {
      pdf: "#ff6b6b",
      doc: "#4dabf7",
      docx: "#4dabf7",
      txt: "#868e96",
      xls: "#51cf66",
      xlsx: "#51cf66",
      ppt: "#ff922b",
      pptx: "#ff922b",
      jpg: "#cc5de8",
      jpeg: "#cc5de8",
      png: "#cc5de8",
      gif: "#cc5de8",
      svg: "#cc5de8",
      zip: "#fcc419",
      rar: "#fcc419",
      "7z": "#fcc419",
    };
    return colors[ext] || "#9a8fa3";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) return <div className="page-loader">Loading...</div>;

  return (
    <div className="page-containers">
      <div className="page-headers">
        <div className="page-header-layout">
          <div>
            <h1 className="headings">
              <BookOpen size={26} />
              Assignments
            </h1>
            <p className="page-subtitle">
              Create and manage your course assignments
            </p>
          </div>
          <div>
            <img src={studentvectorimg} id="assignment-vector" alt="" />
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="file-modal-overlay" onClick={closeFileViewer}>
          <div
            className="file-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="file-modal-header">
              <div className="file-modal-header-left">
                <span className="file-modal-icon">
                  <FileIcon name={selectedFile.name} size={26} />
                </span>
                <div>
                  <h3>{selectedFile.name}</h3>
                  <span className="file-modal-size">
                    {formatFileSize(selectedFile.size)}
                  </span>
                </div>
              </div>
              <button className="file-modal-close" onClick={closeFileViewer}>
                <X size={20} />
              </button>
            </div>
            <div className="file-modal-body">
              {selectedFile?.type === "pdf" ? (
                <embed
                  src={`${FILE_SERVER_URL}/${selectedFile.url}`}
                  type="application/pdf"
                  className="file-pdf-embed"
                />
              ) : selectedFile?.type === "image" ? (
                <div className="file-image-preview">
                  <img
                    src={`${FILE_SERVER_URL}/${selectedFile.url}`}
                    alt={selectedFile.name}
                    className="file-preview-img"
                  />
                </div>
              ) : (
                <div className="file-preview-placeholder">
                  <span className="file-preview-icon">
                    <FileIcon name={selectedFile?.name} size={64} />
                  </span>
                  <p className="file-preview-name">{selectedFile?.name}</p>
                  <div className="file-preview-actions">
                    <a
                      href={`${FILE_SERVER_URL}/${selectedFile?.url}`}
                      download
                      className="file-download-btn"
                    >
                      <Download size={15} />
                      Download File
                    </a>
                    <button
                      className="file-open-btn"
                      onClick={() =>
                        window.open(
                          `${FILE_SERVER_URL}/${selectedFile?.url}`,
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink size={15} />
                      Open in New Tab
                    </button>
                  </div>
                </div>
              )}
            </div>
            {selectedFile.type === "pdf" && (
              <div className="file-modal-footer">
                <a
                  href={`${FILE_SERVER_URL}/${selectedFile.url}`}
                  download
                  className="file-download-btn"
                >
                  <Download size={15} />
                  Download PDF
                </a>
                <button
                  className="file-open-btn"
                  onClick={() =>
                    window.open(
                      `${FILE_SERVER_URL}/${selectedFile.url}`,
                      "_blank",
                    )
                  }
                >
                  <ExternalLink size={15} />
                  Open in New Tab
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="ta-page-layout">
        <div className="ta-form-card">
          <h3 className="ac-form-title">
            <FileText size={18} />
            Create Assignment
          </h3>
          {success && <div className="ta-success">{success}</div>}
          {error && <div className="ta-error">{error}</div>}

          <div className="ta-control-group">
            <label className="ta-label">Assignment Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter assignment title..."
              className="ta-select"
            />
          </div>

          <div className="ta-control-group">
            <label className="ta-label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Provide assignment details..."
              className="ta-textarea"
              rows={3}
            />
          </div>

          <div className="ta-control-group">
            <label className="ta-label">Course</label>
            <select
              name="course_id"
              value={form.course_id}
              onChange={handleChange}
              className="ta-select"
            >
              <option value="">-- Select Course --</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.course_code} — {c.course_name}
                </option>
              ))}
            </select>
          </div>

          <div className="ta-form-row">
            <div className="ta-control-group">
              <label className="ta-label">Due Date</label>
              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                className="ta-select"
              />
            </div>
            <div className="ta-control-group">
              <label className="ta-label">Total Marks</label>
              <input
                type="number"
                name="total_marks"
                value={form.total_marks}
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
            <Rocket size={16} />
            {submitting ? "Creating..." : "Create Assignment"}
          </button>
        </div>

        <div className="accordion-container">
          <div className="accordion-header">
            <h3 className="accordion-title">
              <ClipboardList size={18} />
              My Assignments
              <span className="accordion-badge">{assignments.length}</span>
            </h3>
          </div>

          {assignments.length > 0 ? (
            <div className="accordion-list">
              {assignments.map((assignment, index) => (
                <div
                  key={assignment._id}
                  className={`accordion-item ${expandedId === assignment._id ? "expanded" : ""}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className="accordion-trigger"
                    onClick={() => toggleAccordion(assignment._id)}
                  >
                    <div className="accordion-trigger-left">
                      <div className="accordion-status-indicator">
                        <span className="status-dot"></span>
                      </div>
                      <div className="accordion-content-info">
                        <h4 className="accordion-item-title">
                          {assignment.title}
                        </h4>
                        <div className="accordion-meta">
                          <span className="accordion-course">
                            <BookOpen size={12} />
                            {assignment.course_id?.course_name || "No Course"}
                          </span>
                          <span className="accordion-due">
                            <Calendar size={12} />
                            Due:{" "}
                            {new Date(assignment.due_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                          <span className="accordion-submissions-count">
                            <StatusIcon status="submitted" size={12} />
                            {assignment.submissions?.length || 0} Submissions
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-trigger-right">
                      <span className="accordion-marks">
                        <BarChart3 size={13} />
                        {assignment.total_marks || 0} marks
                      </span>
                      <ChevronDown
                        size={18}
                        className={`accordion-arrow ${expandedId === assignment._id ? "rotated" : ""}`}
                      />
                    </div>
                  </div>

                  <div className="accordion-content">
                    <div className="accordion-content-inner">
                      {assignment.description && (
                        <div className="accordion-description">
                          <p>{assignment.description}</p>
                        </div>
                      )}

                      {assignment.submissions?.length > 0 ? (
                        <div className="submissions-section">
                          <h5 className="submissions-title">
                            <Inbox size={14} />
                            Submissions ({assignment.submissions.length})
                          </h5>
                          <div className="submissions-grid">
                            {assignment.submissions.map((sub, idx) => (
                              <div key={idx} className="submission-card">
                                <div className="submission-card-header">
                                  <div className="submission-user">
                                    <div className="submission-avatar">
                                      {sub.student_id?.full_name?.charAt(0) ||
                                        "S"}
                                    </div>
                                    <div>
                                      <div className="submission-user-name">
                                        {sub.student_id?.full_name ||
                                          "Unknown Student"}
                                      </div>
                                      <div className="submission-user-roll">
                                        {sub.student_id?.roll_number || "N/A"}
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className="submission-status-badge"
                                    style={{
                                      backgroundColor: `${getSubmissionColor(sub.status)}22`,
                                      borderColor: getSubmissionColor(
                                        sub.status,
                                      ),
                                      color: getSubmissionColor(sub.status),
                                    }}
                                  >
                                    <StatusIcon status={sub.status} size={12} />
                                    {sub.status === "late" ? "Late" : "On Time"}
                                  </div>
                                </div>

                                <div className="submission-meta">
                                  <span className="submission-time">
                                    <Clock size={11} />
                                    {new Date(
                                      sub.submitted_at,
                                    ).toLocaleString()}
                                  </span>
                                </div>

                                {sub.message && (
                                  <div className="submission-message">
                                    <MessageSquare size={13} />
                                    {sub.message}
                                  </div>
                                )}

                                {sub.files && sub.files.length > 0 && (
                                  <div className="submission-files">
                                    <div className="files-grid">
                                      {sub.files.map((file, fi) => (
                                        <div
                                          key={fi}
                                          className="file-folder"
                                          onClick={() => handleFileClick(file)}
                                        >
                                          <div className="file-folder-icon">
                                            <FileIcon
                                              name={file.name}
                                              size={32}
                                            />
                                          </div>
                                          <div className="file-folder-info">
                                            <span className="file-folder-name">
                                              {file.name}
                                            </span>
                                            <span className="file-folder-size">
                                              {formatFileSize(file.size)}
                                            </span>
                                          </div>
                                          <div
                                            className="file-folder-badge"
                                            style={{
                                              backgroundColor: getFileTypeColor(
                                                file.name,
                                              ),
                                            }}
                                          >
                                            {file.type ||
                                              file.name
                                                ?.split(".")
                                                .pop()
                                                ?.toUpperCase() ||
                                              "FILE"}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="no-submissions">
                          <span className="no-submissions-icon">
                            <Inbox size={30} />
                          </span>
                          <p>No submissions yet for this assignment</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">
                <FileText size={40} />
              </span>
              <p>No assignments created yet</p>
              <p className="empty-subtext">
                Create your first assignment using the form above!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
