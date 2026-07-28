import React from "react";
import {
  Megaphone,
  FileText,
  CreditCard,
  PartyPopper,
  Pin,
} from "lucide-react";
import "../../styles/WidgetCommon.scss";

const notices = [
  {
    id: 1,
    title: "Mid Term Exams Schedule",
    date: "2026-07-01",
    type: "exam",
    urgent: true,
  },
  {
    id: 2,
    title: "Fee Submission Last Date",
    date: "2026-07-05",
    type: "fee",
    urgent: true,
  },
  {
    id: 3,
    title: "Sports Week Announcement",
    date: "2026-07-10",
    type: "event",
    urgent: false,
  },
  {
    id: 4,
    title: "Library Card Renewal",
    date: "2026-07-15",
    type: "general",
    urgent: false,
  },
];

const typeConfig = {
  exam: { color: "#ef5350", icon: FileText },
  fee: { color: "#ffb74d", icon: CreditCard },
  event: { color: "#64b5f6", icon: PartyPopper },
  general: { color: "#9a8fa3", icon: Pin },
};

export default function NoticeBoard() {
  return (
    <div className="widget-card">
      <div className="widget-header">
        <span className="widget-title">
          <Megaphone size={16} />
          Notice Board
        </span>
        <span className="widget-badge">{notices.length} notices</span>
      </div>
      <div className="notice-list">
        {notices.map((notice) => {
          const config = typeConfig[notice.type];
          const Icon = config.icon;
          return (
            <div key={notice.id} className="notice-item">
              <span className="notice-icon" style={{ color: config.color }}>
                <Icon size={18} />
              </span>
              <div className="notice-info">
                <span className="notice-title">{notice.title}</span>
                <span className="notice-date">
                  {new Date(notice.date).toLocaleDateString()}
                </span>
              </div>
              {notice.urgent && <span className="notice-urgent">Urgent</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
