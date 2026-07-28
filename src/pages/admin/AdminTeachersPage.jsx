import React, { useEffect, useState } from "react";
import { getAllTeachers, deleteUser } from "../../api/adminApi";
import studentvectorimg from "../../assets/png/teacher.png";
import "../../styles/AdminStudentsPage.scss";

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    getAllTeachers()
      .then((res) => setTeachers(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure?")) return;
    setDeleting(userId);
    try {
      await deleteUser(userId);
      setTeachers((prev) => prev.filter((t) => t.user_id?._id !== userId));
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
          <h1 className="page-title">Teachers</h1>
          <p className="page-subtitle">
            All registered teachers — {teachers.length} total
          </p>
        </div>
        <div>
          <img src={studentvectorimg} className="vector-imges" alt="" />
        </div>
      </div>

      <div className="admin-table-card">
        <div
          className="admin-table-header"
          style={{ gridTemplateColumns: "2fr 1fr 2fr 2fr 1fr" }}
        >
          <span>Name</span>
          <span>Employee ID</span>
          <span>Department</span>
          <span>Designation</span>
          <span>Action</span>
        </div>
        {teachers.map((teacher) => (
          <div
            key={teacher._id}
            className="admin-table-row"
            style={{ gridTemplateColumns: "2fr 1fr 2fr 2fr 1fr" }}
          >
            <span className="admin-table-name">{teacher.full_name}</span>
            <span className="admin-table-cell">{teacher.employee_id}</span>
            <span className="admin-table-cell">{teacher.department}</span>
            <span className="admin-table-cell">{teacher.designation}</span>
            <button
              className="admin-delete-btn"
              onClick={() => handleDelete(teacher.user_id?._id)}
              disabled={deleting === teacher.user_id?._id}
            >
              {deleting === teacher.user_id?._id ? "..." : "Delete"}
            </button>
          </div>
        ))}
        {teachers.length === 0 && (
          <div className="empty-state">No teachers found</div>
        )}
      </div>
    </div>
  );
}
