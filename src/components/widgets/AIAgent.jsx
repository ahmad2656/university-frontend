import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Trash2, Send } from "lucide-react";
import { FaRobot } from "react-icons/fa6";
import { sendChatMessage } from "../../api/aiApi";
import { useAuth } from "../../context/AuthContext";
import {
  getProfile,
  getAttendanceSummary,
  getGrades,
  getFeeStatus,
  getAssignments,
} from "../../api/studentApi";
import {
  getTeacherProfile,
  getTeacherCourses,
  getTeacherAssignments,
} from "../../api/teacherApi";
import {
  getAllStudents,
  getAllTeachers,
  getAllUsers,
} from "../../api/adminApi";
import "../../styles/AIAgent.scss";

const INITIAL_MESSAGE = {
  role: "assistant",
  text: "Hi! I'm UniBot — your university assistant. Ask me anything!",
};

export default function AIAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [contextData, setContextData] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fetchedRef = useRef(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.role || fetchedRef.current) return;

    const fetchContext = async () => {
      try {
        fetchedRef.current = true;

        if (user.role === "student") {
          const [profileRes, attRes, gradesRes, feeRes, assignRes] =
            await Promise.all([
              getProfile(),
              getAttendanceSummary(),
              getGrades(),
              getFeeStatus(),
              getAssignments(),
            ]);
          setContextData({
            role: "student",
            profile: profileRes.data.data,
            attendance: attRes.data.data,
            grades: gradesRes.data.data,
            fees: feeRes.data.data,
            assignments: assignRes.data.data,
          });
        } else if (user.role === "teacher") {
          const [profileRes, coursesRes, assignRes] = await Promise.all([
            getTeacherProfile(),
            getTeacherCourses(),
            getTeacherAssignments(),
          ]);
          setContextData({
            role: "teacher",
            profile: profileRes.data.data,
            courses: coursesRes.data.data,
            assignments: assignRes.data.data,
          });
        } else if (user.role === "admin") {
          const [usersRes, studentsRes, teachersRes] = await Promise.all([
            getAllUsers(),
            getAllStudents(),
            getAllTeachers(),
          ]);
          setContextData({
            role: "admin",
            totalUsers: usersRes.data.data.length,
            totalStudents: studentsRes.data.data.length,
            totalTeachers: teachersRes.data.data.length,
            students: studentsRes.data.data,
            teachers: teachersRes.data.data,
          });
        }
      } catch (err) {
        console.error("Context fetch error:", err);
        fetchedRef.current = false;
      }
    };

    fetchContext();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const buildContextString = () => {
    if (!contextData) return "";

    if (contextData.role === "student") {
      const { profile, attendance, grades, fees, assignments } = contextData;
      const calculatedCGPA =
        grades?.length > 0
          ? (
              (grades.reduce((a, b) => a + b.marks, 0) / grades.length / 100) *
              4
            ).toFixed(2)
          : profile?.cgpa || 0;
      return `
STUDENT REAL DATA:
Name: ${profile?.full_name}
Roll Number: ${profile?.roll_number}
Department: ${profile?.department}
Semester: ${profile?.semester}
CGPA: ${calculatedCGPA} 

ATTENDANCE:
Total: ${attendance?.total} | Present: ${attendance?.present} | Absent: ${attendance?.absent} | Leave: ${attendance?.leave} | Percentage: ${attendance?.percentage}%

GRADES:
${grades?.map((g) => `${g.course_id?.course_name}: ${g.marks}/100 (${g.grade_letter})`).join("\n") || "No grades yet"}

FEE STATUS:
${fees?.map((f) => `Semester ${f.semester}: Total Rs ${f.total_amount}, Paid Rs ${f.paid_amount}, Pending Rs ${f.total_amount - f.paid_amount}, Status: ${f.status}, Due: ${new Date(f.due_date).toLocaleDateString()}`).join("\n") || "No fee records"}

ASSIGNMENTS:
${assignments?.map((a) => `${a.title} | ${a.course_id?.course_name} | Due: ${new Date(a.due_date).toLocaleDateString()}`).join("\n") || "No assignments"}

IMPORTANT: Only use this real data. Never make up information.`.trim();
    }

    if (contextData.role === "teacher") {
      const { profile, courses, assignments } = contextData;
      return `
TEACHER REAL DATA:
Name: ${profile?.full_name}
Employee ID: ${profile?.employee_id}
Department: ${profile?.department}
Designation: ${profile?.designation}

MY COURSES (${courses?.length || 0}):
${courses?.map((c) => `${c.course_code} - ${c.course_name} | Sem ${c.semester} | ${c.credit_hours} Credit Hours`).join("\n") || "No courses assigned"}

MY ASSIGNMENTS (${assignments?.length || 0}):
${assignments?.map((a) => `${a.title} | ${a.course_id?.course_name} | Due: ${new Date(a.due_date).toLocaleDateString()} | Submissions: ${a.submissions?.length || 0}`).join("\n") || "No assignments created"}

IMPORTANT: Only use this real data. Never make up information.`.trim();
    }

    if (contextData.role === "admin") {
      const { totalUsers, totalStudents, totalTeachers, students, teachers } =
        contextData;
      return `
ADMIN REAL DATA:
Total Users: ${totalUsers}
Total Students: ${totalStudents}
Total Teachers: ${totalTeachers}

STUDENTS LIST:
${students?.map((s) => `${s.full_name} | ${s.roll_number} | ${s.department} | Sem ${s.semester} | CGPA: ${s.cgpa}`).join("\n") || "No students"}

TEACHERS LIST:
${teachers?.map((t) => `${t.full_name} | ${t.employee_id} | ${t.department} | ${t.designation}`).join("\n") || "No teachers"}

IMPORTANT: Only use this real data. Never make up information.`.trim();
    }

    return "";
  };

  const handleSend = async (text) => {
    if (!text.trim() || loading) return;

    setInput("");
    const newUserMsg = { role: "user", text };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const apiMessages = updatedMessages
        .slice(1)
        .map((m) => ({ role: m.role, content: m.text }));

      const res = await sendChatMessage(
        apiMessages,
        user?.role,
        buildContextString(),
      );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong. Please try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const quickQuestions = {
    student: [
      "My attendance?",
      "Show my grades",
      "Fee status?",
      "Assignments?",
    ],
    teacher: [
      "My courses?",
      "My assignments?",
      "How to mark attendance?",
      "How to add grades?",
    ],
    admin: [
      "Total students?",
      "List all teachers?",
      "How to add course?",
      "How to create fee record?",
    ],
  };

  const questions = quickQuestions[user?.role] || quickQuestions.student;

  return (
    <>
      <button
        className="ai-fab"
        onClick={() => setOpen((p) => !p)}
        title="UniBot"
      >
        <span className="ai-fab-icon">
          {open ? <X size={25} /> : <FaRobot size={25} />}
        </span>
        {!open && <span className="ai-fab-pulse" />}
      </button>

      {open && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div className="ai-header-left">
              <div className="ai-avatar">
                <Bot size={18} />
              </div>
              <div>
                <div className="ai-chat-title">UniBot</div>
                <div className="ai-chat-status">
                  <span className="ai-status-dot" />
                  {user?.role
                    ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Mode`
                    : "Online"}
                </div>
              </div>
            </div>
            <div className="ai-header-actions">
              <button
                className="ai-header-btn"
                onClick={() => setMessages([INITIAL_MESSAGE])}
                title="Clear"
              >
                <Trash2 size={14} />
              </button>
              <button
                className="ai-header-btn"
                onClick={() => setOpen(false)}
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="ai-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`ai-message-wrap ${msg.role === "user" ? "ai-wrap-user" : "ai-wrap-bot"}`}
              >
                {msg.role === "assistant" && (
                  <div className="ai-msg-avatar">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`ai-message ${msg.role === "user" ? "ai-message-user" : "ai-message-bot"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="ai-message-wrap ai-wrap-bot">
                <div className="ai-msg-avatar">
                  <Bot size={14} />
                </div>
                <div className="ai-message ai-message-bot ai-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="ai-quick-questions">
              {questions.map((q) => (
                <button
                  key={q}
                  className="ai-quick-btn"
                  onClick={() => handleSend(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="ai-input-area">
            <input
              ref={inputRef}
              className="ai-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything..."
              disabled={loading}
            />
            <button
              className="ai-send-btn"
              onClick={() => handleSend(input)}
              disabled={loading || !input.trim()}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
