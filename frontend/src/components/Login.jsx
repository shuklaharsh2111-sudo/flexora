import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const role = data.user.role;

      if (role === "super_admin") {
        navigate("/admin/dashboard");
      } else if (role === "gym_owner") {
        navigate("/gym/dashboard");
      } else {
        navigate("/member/dashboard");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <Link to="/" className="brand">
          <span className="brand-icon">F</span>
          <span>FLEXORA</span>
          <small>BY FITORA</small>
        </Link>

        <div className="brand-content">
          <span className="eyebrow">YOUR FITNESS. ONE PLATFORM.</span>

          <h1>
            Everything fitness.
            <br />
            <span>One powerful platform.</span>
          </h1>

          <p>
            Manage your gym, grow your business and build
            stronger fitness communities with Flexora.
          </p>

          <div className="brand-points">
            <span>✦ Smart Gym Management</span>
            <span>✦ Simplified Memberships</span>
            <span>✦ One Connected Platform</span>
          </div>
        </div>

        <div className="brand-footer">
          © 2026 Flexora by Fitora. All rights reserved.
        </div>
      </div>

      <div className="auth-form-side">
        <div className="mobile-brand brand">
          <span className="brand-icon">F</span>
          FLEXORA
        </div>

        <div className="auth-card">
          <div className="form-heading">
            <span className="form-label">WELCOME BACK</span>
            <h2>Sign in to Flexora</h2>
            <p>Enter your details to access your account.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email or Contact Number</label>
              <input
                type="text"
                name="identifier"
                placeholder="Enter email or phone number"
                value={form.identifier}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button className="primary-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
              <span>→</span>
            </button>
          </form>

          <div className="form-divider">
            <span>NEW TO FLEXORA?</span>
          </div>

          <p className="switch-auth">
            Don't have an account?
            <Link to="/register"> Create Account</Link>
          </p>

          <p className="secure-note">
            🔒 Secure authentication powered by Flexora
          </p>
        </div>
      </div>
    </div>
  );
}