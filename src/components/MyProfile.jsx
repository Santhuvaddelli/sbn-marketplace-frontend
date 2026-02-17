import { useEffect, useState } from "react";
import api from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCamera } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "../MyProfile.css";

export default function MyProfile() {
    const [user, setUser] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await api.get("/api/myProfile");
            setUser(res.data.user);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching profile:", err);
            toast.error("Failed to load profile data");
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await api.put("/api/updateProfile", user);
            setEditMode(false);
            toast.success("✅ Profile Updated Successfully");
        } catch (err) {
            console.error("Error updating profile:", err);
            const errorMessage = err.response?.data?.message || "Failed to update profile";
            toast.error(`❌ ${errorMessage}`);
        }
    };

    if (loading) return <div className="profile-loading"><Loader /></div>;

    // Get initials for avatar
    const getInitials = () => {
        const first = user.firstName?.charAt(0) || "";
        const last = user.lastName?.charAt(0) || "";
        return (first + last).toUpperCase() || "U";
    };

    return (
        <div className="profile-wrapper">
            <div className="profile-header-section">
                <div className="header-title-row">
                    <h2>My Profile</h2>
                    {!editMode && (
                        <button className="icon-edit-btn" onClick={() => setEditMode(true)} title="Edit Profile">
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                    )}
                </div>
            </div>

            <div className="profile-card">
                <div className="profile-avatar-section">
                    <div className="avatar-circle">
                        {getInitials()}
                    </div>
                    <div className="avatar-info">
                        <h3>{user.firstName} {user.lastName}</h3>
                        <p>{user.designation || "Member"}</p>
                    </div>
                </div>

                <div className="profile-section">
                    <h3>Personal Information</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                name="firstName"
                                value={user.firstName || ""}
                                onChange={handleChange}
                                disabled={!editMode}
                                className={editMode ? "editable" : ""}
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                name="lastName"
                                value={user.lastName || ""}
                                onChange={handleChange}
                                disabled={!editMode}
                                className={editMode ? "editable" : ""}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                value={user.email || ""}
                                disabled
                                className="disabled-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                name="phone"
                                value={user.phone || ""}
                                onChange={handleChange}
                                disabled={!editMode}
                                className={editMode ? "editable" : ""}
                            />
                        </div>
                    </div>
                </div>

                <div className="profile-section">
                    <h3>Company Details</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Company Name</label>
                            <input
                                name="companyName"
                                value={user.companyName || ""}
                                onChange={handleChange}
                                disabled={!editMode}
                                className={editMode ? "editable" : ""}
                            />
                        </div>
                        <div className="form-group">
                            <label>Designation</label>
                            <input
                                name="designation"
                                value={user.designation || ""}
                                onChange={handleChange}
                                disabled={!editMode}
                                className={editMode ? "editable" : ""}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Company Website</label>
                            <input
                                name="companyWebsite"
                                value={user.companyWebsite || ""}
                                onChange={handleChange}
                                disabled={!editMode}
                                className={editMode ? "editable" : ""}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Location / Address</label>
                            <input
                                name="location"
                                value={user.location || ""}
                                onChange={handleChange}
                                disabled={!editMode}
                                className={editMode ? "editable" : ""}
                            />
                        </div>
                    </div>
                </div>

                {editMode && (
                    <div className="profile-actions">
                        <button className="cancel-btn" onClick={() => {
                            setEditMode(false);
                            fetchUser(); // Reset changes
                        }}>
                            Cancel
                        </button>
                        <button className="save-btn" onClick={handleSave}>
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
