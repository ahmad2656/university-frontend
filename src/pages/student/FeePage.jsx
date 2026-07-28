import React, { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { getFeeStatus, payFee } from "../../api/studentApi";
import feevectorimg from "../../assets/png/payment.png";

import "../../styles/FeePage.scss";

export default function FeePage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [payAmount, setPayAmount] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getFeeStatus()
      .then((res) => setFees(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePay = async (feeId) => {
    const amount = payAmount[feeId];
    if (!amount || amount <= 0) {
      setError("Valid amount enter karo");
      return;
    }
    setPayingId(feeId);
    setError("");
    try {
      const res = await payFee(feeId, amount);
      setFees((prev) => prev.map((f) => (f._id === feeId ? res.data.data : f)));
      setPayAmount({ ...payAmount, [feeId]: "" });
      setSuccess("Payment successful!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
    } finally {
      setPayingId(null);
    }
  };

  const fmt = (n) => `Rs ${n?.toLocaleString()}`;

  const getStatusColor = (status) => {
    if (status === "paid") return "#81c784";
    if (status === "overdue") return "#ef5350";
    return "#ffb74d";
  };

  if (loading) return <div className="page-loader">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-layout">
          <div>
            <h1 className="headings">Fee Status</h1>
            <p className="page-subtitle">Your semester-wise fee details</p>
          </div>
          <div>
            <img
              src={feevectorimg}
              className="vector-imges"
              id="fee-vector"
              alt=""
            />
          </div>
        </div>
      </div>

      {success && <div className="fee-success">{success}</div>}
      {error && <div className="fee-error">{error}</div>}

      <div className="fee-list">
        {fees.map((fee) => {
          const pct = Math.round((fee.paid_amount / fee.total_amount) * 100);
          const pending = fee.total_amount - fee.paid_amount;
          return (
            <div key={fee._id} className="fee-card">
              <div className="fee-card-header">
                <div>
                  <h3 className="fee-semester">Semester {fee.semester}</h3>
                  <p className="fee-due">
                    Due: {new Date(fee.due_date).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className="fee-status-badge"
                  style={{
                    color: getStatusColor(fee.status),
                    background: `${getStatusColor(fee.status)}22`,
                    border: `1px solid ${getStatusColor(fee.status)}44`,
                  }}
                >
                  {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                </span>
              </div>

              <div className="fee-amounts">
                <div className="fee-amount-item">
                  <span className="fee-amount-label">Total</span>
                  <span className="fee-amount-value">
                    {fmt(fee.total_amount)}
                  </span>
                </div>
                <div className="fee-amount-item">
                  <span className="fee-amount-label">Paid</span>
                  <span
                    className="fee-amount-value"
                    style={{ color: "#81c784" }}
                  >
                    {fmt(fee.paid_amount)}
                  </span>
                </div>
                <div className="fee-amount-item">
                  <span className="fee-amount-label">Pending</span>
                  <span
                    className="fee-amount-value"
                    style={{ color: "#ffb74d" }}
                  >
                    {fmt(pending)}
                  </span>
                </div>
              </div>

              <div className="fee-progress-section">
                <div className="fee-progress-label">
                  <span>Payment Progress</span>
                  <span>{pct}%</span>
                </div>
                <div className="fee-progress-bar">
                  <div
                    className="fee-progress-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {fee.status !== "paid" && (
                <div className="fee-pay-section">
                  <input
                    type="number"
                    className="fee-pay-input"
                    placeholder="Amount enter karo"
                    value={payAmount[fee._id] || ""}
                    onChange={(e) =>
                      setPayAmount({ ...payAmount, [fee._id]: e.target.value })
                    }
                    min="1"
                    max={pending}
                  />
                  <button
                    className="fee-pay-btn"
                    onClick={() => handlePay(fee._id)}
                    disabled={payingId === fee._id}
                  >
                    {payingId === fee._id ? "Processing..." : "Pay Now"}
                  </button>
                </div>
              )}

              {fee.status === "paid" && (
                <div className="fee-paid-badge">
                  <CheckCircle2 size={16} />
                  Fully Paid
                </div>
              )}
            </div>
          );
        })}
        {fees.length === 0 && (
          <div className="empty-state">No fee records found</div>
        )}
      </div>
    </div>
  );
}
