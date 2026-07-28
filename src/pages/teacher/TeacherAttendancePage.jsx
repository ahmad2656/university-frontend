import React, { useEffect, useState } from "react";
import {
  getTeacherCourses,
  getStudentsByCourse,
  markAttendance,
} from "../../api/teacherApi";
import "../../styles/TeacherAttendancePage.scss";
import attendancevector from "../../assets/png/attendance.png";

export default function TeacherAttendancePage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getTeacherCourses()
      .then((res) => setCourses(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
    setAttendance({});
    if (courseId) {
      getStudentsByCourse(courseId)
        .then((res) => {
          setStudents(res.data.data);
          const initial = {};
          res.data.data.forEach((s) => {
            initial[s._id] = "present";
          });
          setAttendance(initial);
        })
        .catch(console.error);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (!selectedCourse || !date) {
      setError("Course aur date select karo");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const records = Object.entries(attendance).map(
        ([student_id, status]) => ({
          student_id,
          status,
        }),
      );
      await markAttendance({ course_id: selectedCourse, date, records });
      setSuccess("Attendance marked successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "present") return "#81c784";
    if (status === "absent") return "#ef5350";
    return "#ffb74d";
  };

  if (loading) return <div className="page-loader">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-layout">
          <div>
            <h1 className="page-title">Mark Attendance</h1>
            <p className="page-subtitle">
              Select course and mark student attendance
            </p>
          </div>
          <div>
            <img src={attendancevector} className="vector-imges" id="attendance-vector" alt="" />
          </div>
        </div>
      </div>

      {success && <div className="ta-success">{success}</div>}
      {error && <div className="ta-error">{error}</div>}

      <div className="ta-controls">
        <div className="ta-control-group">
          <label className="ta-label">Select Course</label>
          <select
            className="ta-select"
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.target.value)}
          >
            <option value="">-- Select Course --</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.course_code} — {c.course_name}
              </option>
            ))}
          </select>
        </div>

        <div className="ta-control-group">
          <label className="ta-label">Date</label>
          <input
            type="date"
            className="ta-select"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {students.length > 0 && (
        <>
          <div className="ta-students-list">
            {students.map((student) => (
              <div key={student._id} className="ta-student-row">
                <div className="ta-student-info">
                  <div className="tc-student-avatar">
                    {student.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="tc-student-name">{student.full_name}</span>
                    <span className="tc-student-roll">
                      ({student.roll_number})
                    </span>
                  </div>
                </div>
                <div className="ta-status-buttons">
                  {["present", "absent", "leave"].map((status) => (
                    <button
                      key={status}
                      className={`ta-status-btn ${attendance[student._id] === status ? "ta-status-active" : ""}`}
                      style={{
                        borderColor:
                          attendance[student._id] === status
                            ? getStatusColor(status)
                            : "rgba(255,255,255,0.1)",
                        color:
                          attendance[student._id] === status
                            ? getStatusColor(status)
                            : "#9a8fa3",
                        background:
                          attendance[student._id] === status
                            ? `${getStatusColor(status)}22`
                            : "transparent",
                      }}
                      onClick={() => handleStatusChange(student._id, status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            className="ta-submit-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Attendance"}
          </button>
        </>
      )}

      {selectedCourse && students.length === 0 && (
        <div className="empty-state">No students found for this course</div>
      )}
    </div>
  );
}
