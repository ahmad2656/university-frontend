import React, { useEffect, useState } from "react";
import { BookOpen, FileText, Building2, GraduationCap } from "lucide-react";
import {
  getTeacherProfile,
  getTeacherCourses,
  getTeacherAssignments,
} from "../../api/teacherApi";
import "../../styles/TeacherDashboard.scss";

export default function TeacherDashboard() {
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getTeacherProfile(),
      getTeacherCourses(),
      getTeacherAssignments(),
    ])
      .then(([profileRes, coursesRes, assignRes]) => {
        setProfile(profileRes.data.data);
        setCourses(coursesRes.data.data);
        setAssignments(assignRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Teacher Dashboard</h1>
        <p className="page-subtitle">Welcome back, {profile?.full_name}</p>
      </div>

      <div className="teacher-stats">
        <div className="teacher-stat-card">
          <BookOpen className="teacher-stat-icon" size={24} color="#64b5f6" />
          <span className="teacher-stat-label">My Courses</span>
          <span className="teacher-stat-value" style={{ color: "#64b5f6" }}>
            {courses.length}
          </span>
        </div>
        <div className="teacher-stat-card">
          <FileText className="teacher-stat-icon" size={24} color="#ffb74d" />
          <span className="teacher-stat-label">Assignments</span>
          <span className="teacher-stat-value" style={{ color: "#ffb74d" }}>
            {assignments.length}
          </span>
        </div>
        <div className="teacher-stat-card">
          <Building2 className="teacher-stat-icon" size={24} color="#ce93d8" />
          <span className="teacher-stat-label">Department</span>
          <span
            className="teacher-stat-value"
            style={{ color: "#ce93d8", fontSize: 14 }}
          >
            {profile?.department}
          </span>
        </div>
        <div className="teacher-stat-card">
          <GraduationCap className="teacher-stat-icon" size={24} color="#81c784" />
          <span className="teacher-stat-label">Designation</span>
          <span
            className="teacher-stat-value"
            style={{ color: "#81c784", fontSize: 13 }}
          >
            {profile?.designation}
          </span>
        </div>
      </div>

      <div className="teacher-section-title">My Courses</div>
      <div className="teacher-courses-grid">
        {courses.map((course) => (
          <div key={course._id} className="teacher-course-card">
            <span className="teacher-course-code">
              <BookOpen className="course-code-icon" size={14} />
              {course.course_code}
            </span>
            <h3 className="teacher-course-name">{course.course_name}</h3>
            <div className="teacher-course-meta">
              <span className="course-badge">
                {course.credit_hours} Credit Hours
              </span>
              <span className="course-badge">Sem {course.semester}</span>
              <span className="course-badge">{course.department}</span>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="empty-state">
            No courses assigned yet — Admin se course assign karwao
          </div>
        )}
      </div>

      {assignments.length > 0 && (
        <>
          <div className="teacher-section-title" style={{ marginTop: 24 }}>
            Recent Assignments
          </div>
          <div className="teacher-assignments-list">
            {assignments.map((a) => (
              <div key={a._id} className="teacher-assignment-item">
                <div>
                  <span className="ta-assignment-title">{a.title}</span>
                  <span className="ta-assignment-course">
                    {a.course_id?.course_name}
                  </span>
                  <span className="ta-assignment-due">
                    Due: {new Date(a.due_date).toLocaleDateString()}
                  </span>
                </div>
                <span className="ta-assignment-submissions">
                  {a.submissions?.length || 0} submitted
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}