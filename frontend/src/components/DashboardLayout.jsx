import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "../styles/DashboardLayout.css";
export default function DashboardLayout({ user, children }) {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const roleNames = {
        super_admin: "SUPER ADMIN",
        gym_owner: "GYM OWNER",
        member: "MEMBER",
    };
    const roleLabel = roleNames[user?.role] || "USER";
    const logout = async () => {
        try {
            await api("/auth/logout", {
                method: "POST",
            });
            navigate("/login", { replace: true });
        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <div className={`dashboard-layout ${collapsed ? "sidebar-collapsed" : ""}`}>
            {/* SIDEBAR */}
            <aside className="dashboard-sidebar">
                {/* BRAND */}
                <div className="sidebar-brand">
                    <div className="brand-logo">
                        F
                    </div>
                    {!collapsed && (
                        <span className="brand-name">
                            FLEXORA
                        </span>
                    )}
                    <button
                        className="sidebar-toggle"
                        onClick={() => setCollapsed(!collapsed)}
                        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {collapsed ? "☰" : "✕"}
                    </button>
                </div>
                {/* USER PROFILE */}
                <div className="sidebar-profile">
                    <div className="profile-avatar">
                        {user?.profilePhoto ? (
                            <img
                                src={user.profilePhoto}
                                alt="Profile"
                            />
                        ) : (
                            user?.name?.charAt(0).toUpperCase() || "U"
                        )}
                    </div>
                    {!collapsed && (
                        <div className="profile-info">
                            <h3>{user?.name || "User"}</h3>
                            <span className="profile-role">
                                {roleLabel}
                            </span>
                        </div>
                    )}
                </div>
                {/* NAVIGATION */}
                <div className="sidebar-navigation">
                    {!collapsed && (
                        <span className="navigation-label">
                            MAIN MENU
                        </span>
                    )}
                    {/* Future navigation items will come here */}
                </div>
                {/* LOGOUT */}
                <div className="sidebar-footer">
                    <button
                        className="logout-btn"
                        onClick={logout}
                        title="Logout"
                    >
                        <span className="logout-icon">↗</span>
                        {!collapsed && (
                            <span>Logout</span>
                        )}
                    </button>
                </div>
            </aside>
            {/* MAIN CONTENT */}
            <main className="dashboard-main">
                {children}
            </main>
        </div>
    );
}
