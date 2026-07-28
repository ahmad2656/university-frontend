import React, { useEffect, useState } from "react";
import { BookOpen, UserSquare2 } from "lucide-react";
import { getCourses } from "../../api/studentApi";
import coursevectorimg from "../../assets/png/book.png";
import "../../styles/CoursePage.scss";
export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCourses()
      .then((res) => {
        setCourses(res.data.data || []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load courses");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader">Loading...</div>;

  if (error)
    return (
      <div className="page-container">
        <div className="page-error">{error}</div>
      </div>
    );

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-layout">
          <div>
            <h1 className="headings">My Courses</h1>
            <p className="page-subtitle">Current semester enrolled courses</p>
          </div>
          <div className="course-vector">
            <img
              src={coursevectorimg}
              className="vector-imges"
              alt=""
              id="book-vector"
            />
          </div>
        </div>
      </div>

      <div className="courses-grid">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course._id} className="course-card">
              <BookOpen className="course-icon" size={28} />
              <div className="course-info">
                <span className="course-code">{course.course_code}</span>
                <h3 className="course-name">{course.course_name}</h3>
                <div className="course-meta">
                  <span className="course-badge">
                    {course.credit_hours} Credit Hours
                  </span>
                  <span className="course-badge">{course.department}</span>
                  <span className="course-badge">Sem {course.semester}</span>
                </div>
                {course.teacher_id && (
                  <p className="course-teacher">
                    <UserSquare2 size={13} />
                    {course.teacher_id.full_name || "Assigned Teacher"}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">No courses found for this semester</div>
        )}
      </div>
    </div>
  );
}
