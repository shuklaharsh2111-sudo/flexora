import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function AdminDashboard() {
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
        <span className="form-label">SUPER ADMIN PORTAL</span>
        <h1>Welcome, Administrator!</h1>
        <p>Manage your Flexora SaaS platform.</p>
      </main>
    </div>
  );
}