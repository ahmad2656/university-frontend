import React, { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { getProfile, updateProfile, getCGPATrend } from "../../api/studentApi";
import profilevector from "../../assets/png/profile.png";
import { useAuth } from "../../context/AuthContext";
import "../../styles/ProfilePage.scss";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [cgpa, setCgpa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "" });
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([getProfile(), getCGPATrend()])
      .then(([profileRes, cgpaRes]) => {
        const p = profileRes.data.data;
        setProfile(p);
        setForm({ full_name: p.full_name || "", phone: p.phone || "" });
        setCgpa(cgpaRes.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const currentCGPA =
    cgpa.length > 0 ? cgpa[cgpa.length - 1].cgpa : profile?.cgpa || 0;

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("full_name", form.full_name);
      formData.append("phone", form.phone);
      if (photo) formData.append("photo", photo);

      const res = await updateProfile(formData);
      setProfile(res.data.data);
      setEditing(false);
      setPhoto(null);
      setSuccess("Profile updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-loader">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-layout">
          <div>
            <h1 className="headings">My Profile</h1>
            <p className="page-subtitle">Your personal information</p>
          </div>
          <div>
            <img
              src={profilevector}
              className="vector-imges"
              id="profile-vector"
              alt=""
            />
          </div>
        </div>
      </div>

      {success && <div className="profile-success">{success}</div>}

      {profile && (
        <div className="profile-layout">
          <div className="profile-card">
            <div className="profile-avatar">
              {profile.photo ? (
                <img
                  src={`http://localhost:5000/${profile.photo}`}
                  alt="profile"
                  className="profile-img"
                />
              ) : (
                <span className="profile-avatar-placeholder">
                  {profile.full_name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <h2 className="profile-name">{profile.full_name}</h2>
            <span className="profile-role">Student</span>
            <span className="profile-email">{user?.email}</span>

            {editing && (
              <div className="profile-photo-upload">
                <label className="photo-upload-label">
                  <Camera size={14} />
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                </label>
                {photo && <span className="photo-name">{photo.name}</span>}
              </div>
            )}
          </div>

          <div className="profile-details-card">
            <div className="profile-details-header">
              <h3 className="profile-section-title">Academic Information</h3>
              <div className="profile-actions">
                {editing && (
                  <button
                    className="profile-cancel-btn"
                    onClick={() => {
                      setEditing(false);
                      setPhoto(null);
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  className="profile-edit-btn"
                  onClick={() => (editing ? handleSave() : setEditing(true))}
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editing
                      ? "Save Changes"
                      : "Edit Profile"}
                </button>
              </div>
            </div>

            <div className="profile-details-grid">
              <div className="profile-detail-item">
                <span className="profile-detail-label">Full Name</span>
                {editing ? (
                  <input
                    value={form.full_name}
                    onChange={(e) =>
                      setForm({ ...form, full_name: e.target.value })
                    }
                    className="profile-edit-input"
                    placeholder="Full name"
                  />
                ) : (
                  <span className="profile-detail-value">
                    {profile.full_name}
                  </span>
                )}
              </div>

              <div className="profile-detail-item">
                <span className="profile-detail-label">Roll Number</span>
                <span className="profile-detail-value">
                  {profile.roll_number}
                </span>
              </div>

              <div className="profile-detail-item">
                <span className="profile-detail-label">Department</span>
                <span className="profile-detail-value">
                  {profile.department}
                </span>
              </div>

              <div className="profile-detail-item">
                <span className="profile-detail-label">Semester</span>
                <span className="profile-detail-value">{profile.semester}</span>
              </div>

              <div className="profile-detail-item">
                <span className="profile-detail-label">CGPA</span>
                <span className="profile-detail-cgpa">{currentCGPA}</span>
              </div>

              <div className="profile-detail-item">
                <span className="profile-detail-label">Phone</span>
                {editing ? (
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="profile-edit-input"
                    placeholder="03001234567"
                  />
                ) : (
                  <span className="profile-detail-value">
                    {profile.phone || "N/A"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
