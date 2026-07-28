import React, { useEffect, useState } from "react";
import { getAllTeachers, createCourse } from "../../api/adminApi";
import API from "../../api/axiosConfig";
import coursevector from "../../assets/png/book.png";
import "../../styles/AdminCoursesPage.scss";

const DEPARTMENTS = [
  "Computer Science",
  "Business",
  "Engineering",
  "Medicine",
  "Arts",
  "Law",
];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    course_code: "",
    course_name: "",
    credit_hours: 3,
    department: "Computer Science",
    semester: 1,
    teacher_id: "",
  });

  useEffect(() => {
    Promise.all([
      API.get("/admin/courses").catch(() => ({ data: { data: [] } })),
      getAllTeachers(),
    ])
      .then(([coursesRes, teachersRes]) => {
        setCourses(coursesRes.data.data || []);
        setTeachers(teachersRes.data.data);
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
      const res = await createCourse(form);
      setCourses((prev) => [...prev, res.data.data]);
      setSuccess("Course created successfully!");
      setForm({
        course_code: "",
        course_name: "",
        credit_hours: 3,
        department: "Computer Science",
        semester: 1,
        teacher_id: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
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
            <h1 className="page-title">Courses</h1>
            <p className="page-subtitle">Manage university courses</p>
          </div>
          <div className="studnet-vector">
            <img src={coursevector} className="vector-imges" id="book-vector" alt="" />
          </div>
        </div>
      </div>

      <div className="ac-layout">
        <div className="ac-form-card">
          <h3 className="ac-form-title">Add New Course</h3>
          {success && <div className="ta-success">{success}</div>}
          {error && <div className="ta-error">{error}</div>}

          <div className="ac-form-grid">
            <div className="ta-control-group">
              <label className="ta-label">Course Code</label>
              <input
                name="course_code"
                value={form.course_code}
                onChange={handleChange}
                placeholder="CS301"
                className="ta-select"
              />
            </div>
            <div className="ta-control-group">
              <label className="ta-label">Course Name</label>
              <input
                name="course_name"
                value={form.course_name}
                onChange={handleChange}
                placeholder="Data Structures"
                className="ta-select"
              />
            </div>
            <div className="ta-control-group">
              <label className="ta-label">Credit Hours</label>
              <select
                name="credit_hours"
                value={form.credit_hours}
                onChange={handleChange}
                className="ta-select"
              >
                {[1, 2, 3, 4].map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div className="ta-control-group">
              <label className="ta-label">Department</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="ta-select"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
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
              <label className="ta-label">Assign Teacher</label>
              <select
                name="teacher_id"
                value={form.teacher_id}
                onChange={handleChange}
                className="ta-select"
              >
                <option value="">-- Select Teacher --</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="ta-submit-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Course"}
          </button>
        </div>

        <div className="ac-courses-list">
          <h3 className="ac-list-title">All Courses ({courses.length})</h3>
          {courses.map((course) => (
            <div key={course._id} className="ac-course-item">
              <span className="tc-course-code">{course.course_code}</span>
              <span className="tc-course-name">{course.course_name}</span>
              <span className="tc-course-sem">
                {course.department} • Sem {course.semester}
              </span>
            </div>
          ))}
          {courses.length === 0 && (
            <div className="empty-state">No courses yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
