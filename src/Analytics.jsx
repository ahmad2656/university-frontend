import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { DataGrid } from "@mui/x-data-grid";
import {
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  CreditCard,
  ClipboardList,
} from "lucide-react";
import {
  getAttendanceSummary,
  getAttendanceLog,
  getGrades,
  getCGPATrend,
  getFeeStatus,
} from "./api/studentApi";
import NoticeBoard from "./components/widgets/NoticeBoard";
import UpcomingDeadlines from "./components/widgets/UpcomingDeadlines";
import analysisvector from "../src/assets/png/analysis.png";
import "./styles/Analytics.scss";

const BG_CARD = "#2E2431";
const BORDER = "rgba(255,255,255,0.07)";
const TEXT = "#f0ecf4";
const MUTED = "#9a8fa3";

const axisStyle = {
  "& .MuiChartsAxis-label": { fill: MUTED, fontSize: 12 },
  "& .MuiChartsAxis-tickLabel": { fill: MUTED, fontSize: 11 },
  "& .MuiChartsAxis-line": { stroke: BORDER },
  "& .MuiChartsAxis-tick": { stroke: BORDER },
  "& .MuiChartsLegend-label": { fill: MUTED, fontSize: 12 },
  "& .MuiChartsGrid-line": { stroke: "rgba(255,255,255,0.04)" },
};

const gridSx = {
  border: "none",
  color: TEXT,
  backgroundColor: BG_CARD,
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: `${BG_CARD} !important`,
    borderBottom: `1px solid ${BORDER}`,
  },
  "& .MuiDataGrid-columnHeader": { backgroundColor: `${BG_CARD} !important` },
  "& .MuiDataGrid-columnHeaderTitle": {
    color: MUTED,
    fontWeight: 600,
    fontSize: 13,
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": { color: MUTED },
  "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": { color: MUTED },
  "& .MuiDataGrid-iconButtonContainer .MuiSvgIcon-root": { color: MUTED },
  "& .MuiDataGrid-menuIcon .MuiSvgIcon-root": { color: MUTED },
  "& .MuiDataGrid-row": { backgroundColor: BG_CARD },
  "& .MuiDataGrid-row:hover": { backgroundColor: "rgba(255,255,255,0.04)" },
  "& .MuiDataGrid-row.Mui-selected": {
    backgroundColor: "rgba(100,181,246,0.08)",
  },
  "& .MuiDataGrid-row.Mui-selected:hover": {
    backgroundColor: "rgba(100,181,246,0.12)",
  },
  "& .MuiDataGrid-cell": { color: TEXT, borderColor: BORDER, fontSize: 13 },
  "& .MuiDataGrid-cell:focus": { outline: "none" },
  "& .MuiDataGrid-cell:focus-within": { outline: "none" },
  "& .MuiDataGrid-virtualScroller": { backgroundColor: BG_CARD },
  "& .MuiDataGrid-overlayWrapper": { backgroundColor: BG_CARD },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: `${BG_CARD} !important`,
    borderTop: `1px solid ${BORDER}`,
  },
  "& .MuiTablePagination-root": { color: MUTED },
  "& .MuiTablePagination-selectLabel": { color: MUTED },
  "& .MuiTablePagination-displayedRows": { color: MUTED },
  "& .MuiTablePagination-actions button": { color: MUTED },
  "& .MuiTablePagination-select": { color: MUTED },
  "& .MuiCheckbox-root": { color: MUTED },
  "& .MuiDataGrid-selectedRowCount": { color: MUTED },
  "& .MuiDataGrid-columnSeparator": { color: BORDER },
  "& .MuiSvgIcon-root": { color: MUTED },
  "& .MuiDataGrid-scrollbar": { backgroundColor: BG_CARD },
};

function Card({ icon: Icon, title, subtitle, badge, children }) {
  return (
    <div className="analytics-card">
      <div className="analytics-card-header">
        <div>
          <div className="analytics-card-title">
            {Icon && <Icon size={17} />}
            {title}
          </div>
          <div className="analytics-card-subtitle">{subtitle}</div>
        </div>
        <span className="analytics-card-badge">{badge}</span>
      </div>
      {children}
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div className="stat-pill">
      <span className="stat-pill-label">{label}</span>
      <span className="stat-pill-value" style={{ color: color || TEXT }}>
        {value}
      </span>
    </div>
  );
}

function EmptyState({ text }) {
  return <div className="analytics-empty-state">{text}</div>;
}

function PageLoader() {
  return <div className="page-loader">Loading...</div>;
}

function FeeProgress({ totalFee, paid }) {
  const pending = totalFee - paid;
  const pct = Math.round((paid / totalFee) * 100);
  const fmt = (n) => `Rs ${n.toLocaleString()}`;

  return (
    <div className="fee-progress">
      <div className="fee-progress-stats">
        <div className="fee-stat-item">
          <div className="fee-stat-label">Total Fee</div>
          <div className="fee-stat-value">{fmt(totalFee)}</div>
        </div>
        <div className="fee-stat-item">
          <div className="fee-stat-label">Paid</div>
          <div className="fee-stat-value is-success">{fmt(paid)}</div>
        </div>
        <div className="fee-stat-item">
          <div className="fee-stat-label">Pending</div>
          <div className="fee-stat-value is-warning">{fmt(pending)}</div>
        </div>
      </div>
      <div className="fee-progress-bar-section">
        <div className="fee-progress-bar-label">
          <span className="fee-progress-bar-label-text">Payment progress</span>
          <span className="fee-progress-bar-percent">{pct}%</span>
        </div>
        <div className="fee-progress-bar-track">
          <div className="fee-progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="fee-progress-status">
        <span
          className={`fee-progress-dot ${pending === 0 ? "is-paid" : "is-pending"}`}
        />
        {pending === 0
          ? "Fully paid for this semester"
          : `${fmt(pending)} due — pay before deadline`}
      </div>
    </div>
  );
}

const attendanceColumns = [
  { field: "id", headerName: "ID", width: 60 },
  { field: "date", headerName: "Date", flex: 1, minWidth: 130 },
  { field: "subject", headerName: "Subject", flex: 1, minWidth: 160 },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (p) => {
      const colorMap = {
        Present: "#81c784",
        Absent: "#ef5350",
        Leave: "#ffb74d",
      };
      const c = colorMap[p.value] || MUTED;
      return (
        <span
          style={{
            background: `${c}22`,
            color: c,
            padding: "3px 12px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            border: `1px solid ${c}4D`,
          }}
        >
          {p.value}
        </span>
      );
    },
  },
];

const truncate = (str, n = 10) =>
  str && str.length > n ? str.substring(0, n) + "…" : str;

export default function Analytics() {
  const [attendance, setAttendance] = useState(null);
  const [attendanceLog, setAttendanceLog] = useState([]);
  const [grades, setGrades] = useState([]);
  const [cgpa, setCgpa] = useState([]);
  const [fee, setFee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [attRes, logRes, gradeRes, cgpaRes, feeRes] = await Promise.all([
          getAttendanceSummary(),
          getAttendanceLog(),
          getGrades(),
          getCGPATrend(),
          getFeeStatus(),
        ]);

        setAttendance(attRes.data.data);

        const logData = (logRes.data.data || []).map((item, index) => ({
          id: index + 1,
          date: new Date(item.date).toLocaleDateString(),
          subject: item.course_id?.course_name || "N/A",
          status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        }));
        setAttendanceLog(logData);

        const gradeData = (gradeRes.data.data || []).map((g) => ({
          subject: g.course_id?.course_name || "N/A",
          marks: g.marks,
        }));
        setGrades(gradeData);

        setCgpa(cgpaRes.data.data || []);

        if (feeRes.data.data && feeRes.data.data.length > 0) {
          setFee(feeRes.data.data[0]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <PageLoader />;

  const attendanceBreakdown = attendance
    ? [
        {
          id: 0,
          label: "Present",
          value: attendance.present || 0,
          color: "#81c784",
        },
        {
          id: 1,
          label: "Absent",
          value: attendance.absent || 0,
          color: "#ef5350",
        },
        {
          id: 2,
          label: "Leave",
          value: attendance.leave || 0,
          color: "#ffb74d",
        },
      ]
    : [];

  const hasAttendance = attendanceBreakdown.some((d) => d.value > 0);
  const presentPct = attendance?.percentage || 0;
  const currentCGPA = cgpa.length > 0 ? cgpa[cgpa.length - 1].cgpa : 0;
  const avgMarks =
    grades.length > 0
      ? (grades.reduce((a, b) => a + b.marks, 0) / grades.length).toFixed(0)
      : 0;
  const feePct = fee
    ? Math.round((fee.paid_amount / fee.total_amount) * 100)
    : 0;

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="analytics-header-layout">
          <div>
            <h1 className="analytics-title">Student Analytics</h1>
            <p className="analytics-subtitle">
              University dashboard — Current Semester
            </p>
          </div>
          <div>
            <img
              src={analysisvector}
              id="analysis-vector"
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="stat-pills-row">
        <StatPill label="Attendance" value={`${presentPct}%`} color="#81c784" />
        <StatPill label="Current CGPA" value={currentCGPA} color="#ce93d8" />
        <StatPill label="Avg Marks" value={`${avgMarks}%`} color="#64b5f6" />
        <StatPill label="Fee Paid" value={`${feePct}%`} color="#ffb74d" />
      </div>

      <div className="analytics-grid">
        <Card
          icon={PieChartIcon}
          title="Attendance Breakdown"
          subtitle="Present vs Absent vs Leave"
          badge="Donut"
        >
          {hasAttendance ? (
            <PieChart
              series={[
                {
                  data: attendanceBreakdown,
                  innerRadius: 60,
                  outerRadius: 110,
                  paddingAngle: 2,
                  cornerRadius: 4,
                  highlightScope: { fade: "global", highlight: "item" },
                },
              ]}
              height={280}
              margin={{ top: 16, bottom: 16, left: 16, right: 16 }}
              sx={{
                ...axisStyle,
                "& .MuiChartsLegend-series text": {
                  fill: `${MUTED} !important`,
                  fontSize: "12px !important",
                },
              }}
              slotProps={{
                legend: {
                  direction: "horizontal",
                  position: { vertical: "bottom", horizontal: "middle" },
                  labelStyle: { fill: MUTED, fontSize: 12 },
                },
              }}
            />
          ) : (
            <EmptyState text="No attendance records yet" />
          )}
        </Card>

        <Card
          icon={BarChart3}
          title="Subject-wise Marks"
          subtitle="Current semester performance"
          badge={`Avg ${avgMarks}%`}
        >
          {grades.length > 0 ? (
            <div style={{ width: "100%", overflowX: "auto" }}>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: grades.map((d) => truncate(d.subject, 10)),
                    tickLabelStyle: {
                      fill: MUTED,
                      fontSize: 9,
                      angle: -35,
                      textAnchor: "end",
                    },
                  },
                ]}
                yAxis={[
                  { max: 100, tickLabelStyle: { fill: MUTED, fontSize: 11 } },
                ]}
                series={[
                  {
                    data: grades.map((d) => d.marks),
                    label: "Marks (%)",
                    color: "#64b5f6",
                  },
                ]}
                height={280}
                margin={{ left: 50, right: 20, top: 16, bottom: 80 }}
                borderRadius={6}
                sx={axisStyle}
                slotProps={{
                  legend: { labelStyle: { fill: MUTED, fontSize: 12 } },
                }}
              />
            </div>
          ) : (
            <EmptyState text="No grades recorded yet" />
          )}
        </Card>
      </div>

      <div className="analytics-grid">
        <Card
          icon={TrendingUp}
          title="CGPA Trend"
          subtitle="Semester-wise progress"
          badge={`Now ${currentCGPA}`}
        >
          {cgpa.length > 0 ? (
            <LineChart
              xAxis={[
                {
                  scaleType: "point",
                  data: cgpa.map((d) => d.semester),
                  tickLabelStyle: { fill: MUTED, fontSize: 11 },
                },
              ]}
              yAxis={[
                {
                  min: 2.5,
                  max: 4.0,
                  tickLabelStyle: { fill: MUTED, fontSize: 11 },
                },
              ]}
              series={[
                {
                  data: cgpa.map((d) => d.cgpa),
                  label: "CGPA",
                  color: "#ce93d8",
                  curve: "catmullRom",
                  showMark: true,
                  area: true,
                },
              ]}
              height={280}
              margin={{ left: 50, right: 20, top: 16, bottom: 40 }}
              sx={{
                ...axisStyle,
                "& .MuiAreaElement-root": { fillOpacity: 0.15 },
              }}
              slotProps={{
                legend: { labelStyle: { fill: MUTED, fontSize: 12 } },
              }}
            />
          ) : (
            <EmptyState text="No CGPA data yet" />
          )}
        </Card>

        <Card
          icon={CreditCard}
          title="Fee Status"
          subtitle="Current semester payment"
          badge={fee?.status || "N/A"}
        >
          {fee ? (
            <FeeProgress totalFee={fee.total_amount} paid={fee.paid_amount} />
          ) : (
            <EmptyState text="No fee record found" />
          )}
        </Card>
      </div>

      <div className="analytics-grid">
        <NoticeBoard />
        <UpcomingDeadlines />
      </div>

      <Card
        icon={ClipboardList}
        title="Attendance Log"
        subtitle="Recent class-wise attendance record"
        badge={`${attendanceLog.length} entries`}
      >
        <div style={{ height: 420 }}>
          <DataGrid
            rows={attendanceLog}
            columns={attendanceColumns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 5 } },
              sorting: { sortModel: [{ field: "date", sort: "desc" }] },
            }}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
            density="comfortable"
            sx={gridSx}
          />
        </div>
      </Card>
    </div>
  );
}
