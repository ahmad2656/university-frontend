import React, { useEffect, useState } from "react";
import {
  getTeacherCourses,
  getStudentsByCourse,
  addGrade,
} from "../../api/teacherApi";
import "../../styles/TeacherGradesPages.scss";
import gradevector from "../../assets/png/grades.png";

export default function TeacherGradesPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
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
    if (courseId) {
      getStudentsByCourse(courseId)
        .then((res) => setStudents(res.data.data))
        .catch(console.error);
    }
  };

  const handleGradeChange = (studentId, marks) => {
    setGrades((prev) => ({ ...prev, [studentId]: marks }));
  };

  const handleSubmitGrade = async (studentId) => {
    const course = courses.find((c) => c._id === selectedCourse);
    if (!grades[studentId]) {
      setError("Marks enter karo pehle");
      return;
    }
    setSubmitting(studentId);
    setError("");
    try {
      await addGrade({
        student_id: studentId,
        course_id: selectedCourse,
        semester: course?.semester,
        marks: Number(grades[studentId]),
      });
      setSuccess(`Grade saved successfully!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save grade");
    } finally {
      setSubmitting(null);
    }
  };

  const getMarksColor = (marks) => {
    if (marks >= 80) return "#81c784";
    if (marks >= 60) return "#ffb74d";
    return "#ef5350";
  };

  if (loading) return <div className="page-loader">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-layout">
          <div>
            <h1 className="page-title">Add Grades</h1>
            <p className="page-subtitle">Enter marks for each student</p>
          </div>
          <div>
            <img src={gradevector} alt="" id="grade-vector" />
          </div>
        </div>
      </div>

      {success && <div className="ta-success">{success}</div>}
      {error && <div className="ta-error">{error}</div>}

      <div className="tg-control-group">
        <label className="ta-label">Select Course</label>
        <select
          className="ta-select"
          value={selectedCourse}
          onChange={(e) => handleCourseChange(e.target.value)}
          style={{ maxWidth: 400 }}
        >
          <option value="">-- Select Course --</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.course_code} — {c.course_name}
            </option>
          ))}
        </select>
      </div>

      {students.length > 0 && (
        <div className="tg-students-list">
          {students.map((student) => (
            <div key={student._id} className="tg-student-row">
              <div className="ta-student-info">
                <div className="tc-student-avatar">
                  {student.full_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="tc-student-name">{student.full_name}</span>
                  <span className="tc-student-roll">{student.roll_number}</span>
                </div>
              </div>

              <div className="tg-marks-input-group">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Marks (0-100)"
                  className="tg-marks-input"
                  value={grades[student._id] || ""}
                  onChange={(e) =>
                    handleGradeChange(student._id, e.target.value)
                  }
                />
                {grades[student._id] && (
                  <span
                    className="tg-marks-preview"
                    style={{
                      color: getMarksColor(Number(grades[student._id])),
                    }}
                  >
                    {grades[student._id]}/100
                  </span>
                )}
                <button
                  className="tg-save-btn"
                  onClick={() => handleSubmitGrade(student._id)}
                  disabled={submitting === student._id}
                >
                  {submitting === student._id ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCourse && students.length === 0 && (
        <div className="empty-state">No students found for this course</div>
      )}
    </div>
  );
}
