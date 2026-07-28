import React, { useEffect, useState } from "react";
import { getAttendanceSummary, getAttendanceLog } from "../../api/studentApi";
import "../../styles/AttendancePage.scss";

export default function AttendancePage() {
  const [summary, setSummary] = useState(null);
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAttendanceSummary(), getAttendanceLog()])
      .then(([sumRes, logRes]) => {
        setSummary(sumRes.data.data);
        setLog(logRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    if (status === "present") return "#81c784";
    if (status === "absent") return "#ef5350";
    return "#ffb74d";
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="headings">Attendance</h1>
        <p className="page-subtitle">Your attendance record this semester</p>
      </div>

      {loading ? <div className="page-loader">Loading...</div> : (
        <>
          {summary && (
            <div className="att-summary-grid">
              <div className="att-summary-card" style={{ borderColor: "rgba(129,199,132,0.3)" }}>
                <span className="att-summary-label">Present</span>
                <span className="att-summary-value" style={{ color: "#81c784" }}>{summary.present}</span>
              </div>
              <div className="att-summary-card" style={{ borderColor: "rgba(239,83,80,0.3)" }}>
                <span className="att-summary-label">Absent</span>
                <span className="att-summary-value" style={{ color: "#ef5350" }}>{summary.absent}</span>
              </div>
              <div className="att-summary-card" style={{ borderColor: "rgba(255,183,77,0.3)" }}>
                <span className="att-summary-label">Leave</span>
                <span className="att-summary-value" style={{ color: "#ffb74d" }}>{summary.leave}</span>
              </div>
              <div className="att-summary-card" style={{ borderColor: "rgba(155,114,207,0.3)" }}>
                <span className="att-summary-label">Percentage</span>
                <span className="att-summary-value" style={{ color: "#ce93d8" }}>{summary.percentage}%</span>
              </div>
            </div>
          )}

          <div className="att-log-card">
            <h3 className="att-log-title">Attendance Log</h3>
            <div className="att-log-table">
              <div className="att-log-header">
                <span>Date</span>
                <span>Subject</span>
                <span>Status</span>
              </div>
              {log.map((item, i) => (
                <div key={i} className="att-log-row">
                  <span className="att-log-date">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                  <span className="att-log-subject">
                    {item.course_id?.course_name || "N/A"}
                  </span>
                  <span
                    className="att-log-status"
                    style={{
                      color: getStatusColor(item.status),
                      background: `${getStatusColor(item.status)}22`,
                      border: `1px solid ${getStatusColor(item.status)}44`,
                    }}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              ))}
              {log.length === 0 && (
                <div className="att-log-empty">No attendance records found</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}