import React, { useEffect, useState } from "react";
import { getAllStudents, deleteUser } from "../../api/adminApi";
import studentvectorimg from "../../assets/png/tutoring.png";
import "../../styles/AdminStudentsPage.scss";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    getAllStudents()
      .then((res) => setStudents(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    setDeleting(userId);
    try {
      await deleteUser(userId);
      setStudents((prev) => prev.filter((s) => s.user_id?._id !== userId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="page-loader">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header-layout">
        <div className="page-header">
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">
            All registered students — {students.length} total
          </p>
        </div>

        <div className="student-vector">
          <img src={studentvectorimg} className="vector-imges" alt="" />
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <span>Name</span>
          <span>Roll No</span>
          <span>Department</span>
          <span>Semester</span>
          <span>CGPA</span>
          <span>Action</span>
        </div>
        {students.map((student) => (
          <div key={student._id} className="admin-table-row">
            <span className="admin-table-name">{student.full_name}</span>
            <span className="admin-table-cell">{student.roll_number}</span>
            <span className="admin-table-cell">{student.department}</span>
            <span className="admin-table-cell">Sem {student.semester}</span>
            <span className="admin-table-cell" style={{ color: "#81c784" }}>
              {student.cgpa}
            </span>
            <button
              className="admin-delete-btn"
              onClick={() => handleDelete(student.user_id?._id)}
              disabled={deleting === student.user_id?._id}
            >
              {deleting === student.user_id?._id ? "..." : "Delete"}
            </button>
          </div>
        ))}
        {students.length === 0 && (
          <div className="empty-state">No students found</div>
        )}
      </div>
    </div>
  );
}
