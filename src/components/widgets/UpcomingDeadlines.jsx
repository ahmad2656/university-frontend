import React, { useEffect, useState } from "react";
import { Clock, FileText } from "lucide-react";
import { getAssignments } from "../../api/studentApi";
import "../../styles/WidgetCommon.scss";

export default function UpcomingDeadlines() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    getAssignments()
      .then((res) => setAssignments(res.data.data.slice(0, 4)))
      .catch(console.error);
  }, []);

  const getDaysLeft = (due_date) => {
    const diff = new Date(due_date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: "Overdue", color: "#ef5350" };
    if (days === 0) return { text: "Due today", color: "#ffb74d" };
    if (days <= 3) return { text: `${days}d left`, color: "#ffb74d" };
    return { text: `${days}d left`, color: "#81c784" };
  };

  return (
    <div className="widget-card">
      <div className="widget-header">
        <span className="widget-title">
          <Clock size={16} />
          Upcoming Deadlines
        </span>
        <span className="widget-badge">{assignments.length}</span>
      </div>
      <div className="notice-list">
        {assignments.map((a) => {
          const { text, color } = getDaysLeft(a.due_date);
          return (
            <div key={a._id} className="notice-item">
              <span className="notice-icon" style={{ color: "#9b72cf" }}>
                <FileText size={18} />
              </span>
              <div className="notice-info">
                <span className="notice-title">{a.title}</span>
                <span className="notice-date">{a.course_id?.course_name}</span>
              </div>
              <span className="notice-days-left" style={{ color }}>
                {text}
              </span>
            </div>
          );
        })}
        {assignments.length === 0 && (
          <span className="notice-empty">No upcoming deadlines</span>
        )}
      </div>
    </div>
  );
}
