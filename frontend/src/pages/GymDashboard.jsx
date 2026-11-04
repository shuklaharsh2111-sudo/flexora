import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function GymDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const message = location.state?.message;

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
        <span className="form-label">GYM OWNER PORTAL</span>

        <h1>Welcome to Flexora!</h1>

        <p>Your gym management journey starts here.</p>

        {message && (
          <div className="success-message">{message}</div>
        )}

        <div className="dashboard-notice">
          <span>✦</span>
          <div>
            <h3>Registration submitted successfully</h3>
            <p>
              Your gym is currently pending admin approval.
              You will be able to manage your gym once it is approved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}