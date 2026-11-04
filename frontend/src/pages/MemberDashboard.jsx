import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function MemberDashboard() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="brand">
          <span className="brand-icon">F</span>
          FLEXORA
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout ↗
        </button>
      </header>

      <main className="dashboard-content">
        <span className="form-label">MEMBER PORTAL</span>

        <h1>Welcome to Flexora!</h1>

        <p>Your fitness journey starts here.</p>

        <div className="dashboard-notice">
          <span>✦</span>
          <div>
            <h3>Your account is ready!</h3>
            <p>
              Explore fitness communities and manage your
              gym memberships from one platform.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}