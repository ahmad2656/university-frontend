import React from "react";
import {
  BarChart3,
  GraduationCap,
  BookOpen,
  CreditCard,
  Zap,
} from "lucide-react";
import "./styles/WidgetCommon.scss";
import "./styles/QuickStats.scss";

export default function QuickStats({ attendance, cgpa, grades, fee }) {
  const items = [
    {
      label: "Attendance",
      value: `${attendance?.percentage || 0}%`,
      color: "#81c784",
      icon: BarChart3,
    },
    {
      label: "CGPA",
      value: cgpa || "0.00",
      color: "#ce93d8",
      icon: GraduationCap,
    },
    {
      label: "Subjects",
      value: grades?.length || 0,
      color: "#64b5f6",
      icon: BookOpen,
    },
    {
      label: "Fee Due",
      value: fee
        ? `Rs ${(fee.total_amount - fee.paid_amount).toLocaleString()}`
        : "N/A",
      color: "#ffb74d",
      icon: CreditCard,
    },
  ];

  return (
    <div className="widget-card">
      <div className="widget-header">
        <span className="widget-title">
          <Zap size={16} />
          Quick Stats
        </span>
      </div>
      <div className="qs-grid">
        {items.map((item) => (
          <div key={item.label} className="qs-item">
            <item.icon
              className="qs-icon"
              size={20}
              style={{ color: item.color }}
            />
            <span className="qs-value" style={{ color: item.color }}>
              {item.value}
            </span>
            <span className="qs-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
