import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getTeacherCourses, getStudentsByCourse } from "../../api/teacherApi";
import coursevector from "../../assets/png/book.png";
import "../../styles/TeacherCoursesPage.scss";

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    getTeacherCourses()
      .then((res) => setCourses(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setStudentsLoading(true);
    getStudentsByCourse(course._id)
      .then((res) => setStudents(res.data.data))
      .catch(console.error)
      .finally(() => setStudentsLoading(false));
  };

  const getCGPAColor = (cgpa) => {
    if (cgpa >= 3.5) return "#81c784";
    if (cgpa >= 3.0) return "#64b5f6";
    if (cgpa >= 2.5) return "#ffb74d";
    if (cgpa > 0) return "#ef5350";
    return "#9a8fa3";
  };

  const getCGPALabel = (cgpa) => {
    if (cgpa >= 3.5) return "Excellent";
    if (cgpa >= 3.0) return "Good";
    if (cgpa >= 2.5) return "Average";
    if (cgpa > 0) return "Below Avg";
    return "No Data";
  };

  if (loading) return <div className="page-loader">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-layout">
          <div>
            <h1 className="page-title">My Courses</h1>
            <p className="page-subtitle">
              Click a course to view enrolled students
            </p>
          </div>
          <img
            src={coursevector}
            id="books-vector"
            alt=""
          />
        </div>
      </div>

      <div className="tc-layout">
        <div className="tc-courses-list">
          {courses.map((course) => (
            <div
              key={course._id}
              className={`tc-course-item ${selectedCourse?._id === course._id ? "tc-course-active" : ""}`}
              onClick={() => handleCourseClick(course)}
            >
              <span className="tc-course-code">{course.course_code}</span>
              <span className="tc-course-name">{course.course_name}</span>
              <span className="tc-course-sem">Sem {course.semester}</span>
            </div>
          ))}
          {courses.length === 0 && (
            <div className="empty-state">No courses assigned</div>
          )}
        </div>

        <div className="tc-students-panel">
          {!selectedCourse ? (
            <div className="tc-select-hint">
              <ArrowLeft size={16} />
              Select a course to view students
            </div>
          ) : studentsLoading ? (
            <div className="page-loader">Loading students...</div>
          ) : (
            <>
              <div className="tc-students-header">
                <h3 className="tc-students-title">
                  Students in {selectedCourse.course_name}
                </h3>
                <span className="tc-students-count">{students.length}</span>
              </div>

              {students.length > 0 && (
                <div className="tc-students-summary">
                  <div className="tc-summary-item">
                    <span className="tc-summary-label">Avg CGPA</span>
                    <span
                      className="tc-summary-value"
                      style={{ color: "#81c784" }}
                    >
                      {(
                        students.reduce((a, b) => a + (b.cgpa || 0), 0) /
                        students.length
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="tc-summary-item">
                    <span className="tc-summary-label">Total Students</span>
                    <span
                      className="tc-summary-value"
                      style={{ color: "#64b5f6" }}
                    >
                      {students.length}
                    </span>
                  </div>
                  <div className="tc-summary-item">
                    <span className="tc-summary-label">Top CGPA</span>
                    <span
                      className="tc-summary-value"
                      style={{ color: "#ce93d8" }}
                    >
                      {Math.max(...students.map((s) => s.cgpa || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="tc-students-list">
                {students.map((student) => {
                  const cgpa = student.cgpa || 0;
                  const color = getCGPAColor(cgpa);
                  const label = getCGPALabel(cgpa);
                  const pct = Math.min((cgpa / 4.0) * 100, 100);

                  return (
                    <div key={student._id} className="tc-student-item">
                      <div className="tc-student-avatar">
                        {student.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="tc-student-info">
                        <span className="tc-student-name">
                          {student.full_name}
                        </span>
                        <span className="tc-student-roll">
                          {student.roll_number}
                        </span>
                      </div>
                      <div className="tc-student-cgpa-section">
                        <div className="tc-cgpa-top">
                          <span className="tc-cgpa-value" style={{ color }}>
                            {cgpa.toFixed(2)}
                          </span>
                          <span
                            className="tc-cgpa-badge"
                            style={{
                              color,
                              background: `${color}22`,
                              border: `1px solid ${color}44`,
                            }}
                          >
                            {label}
                          </span>
                        </div>
                        <div className="tc-cgpa-bar">
                          <div
                            className="tc-cgpa-fill"
                            style={{ width: `${pct}%`, background: color }}
                          />
                        </div>
                        <div className="tc-cgpa-scale">
                          <span>0.0</span>
                          <span>4.0</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {students.length === 0 && (
                  <div className="empty-state">No students found</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
