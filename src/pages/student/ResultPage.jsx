import React, { useEffect, useState } from "react";
import { getGrades } from "../../api/studentApi";
import "../../styles/ResultPage.scss";
import resultvectorimg from "../../assets/png/results.png";
export default function ResultPage() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGrades()
      .then((res) => setGrades(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getGradeClass = (letter) => {
    if (["A+", "A"].includes(letter)) return "result-grade-a";
    if (["B+", "B"].includes(letter)) return "result-grade-b";
    if (["C+", "C"].includes(letter)) return "result-grade-c";
    return "result-grade-d";
  };

  const avgMarks =
    grades.length > 0
      ? (grades.reduce((a, b) => a + b.marks, 0) / grades.length).toFixed(1)
      : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-layout">
          <div>
            <h1 className="headings">Results</h1>
            <p className="page-subtitle">Subject-wise marks and grades</p>
          </div>
          <div className="result-vector">
            <img
              src={resultvectorimg}
              className="vector-imges"
              id="result-vector"
              alt=""
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="page-loader">Loading...</div>
      ) : (
        <>
          <div className="result-summary">
            <div className="result-summary-item">
              <span className="result-summary-label">Total Subjects</span>
              <span className="result-summary-value result-summary-value-info">
                {grades.length}
              </span>
            </div>
            <div className="result-summary-item">
              <span className="result-summary-label">Average Marks</span>
              <span className="result-summary-value result-summary-value-accent">
                {avgMarks}%
              </span>
            </div>
          </div>

          <div className="result-list">
            {grades.map((grade, i) => (
              <div key={grade._id} className="result-card">
                <div className="result-card-left">
                  <span className="result-rank">#{i + 1}</span>
                  <div>
                    <h3 className="result-subject">
                      {grade.course_id?.course_name || "N/A"}
                    </h3>
                    <span className="result-code">
                      {grade.course_id?.course_code || ""}
                    </span>
                  </div>
                </div>
                <div className="result-card-right">
                  <span className="result-marks">{grade.marks}/100</span>
                  <span
                    className={`result-grade ${getGradeClass(grade.grade_letter)}`}
                  >
                    {grade.grade_letter}
                  </span>
                </div>
              </div>
            ))}
            {grades.length === 0 && (
              <div className="empty-state">No results found</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
