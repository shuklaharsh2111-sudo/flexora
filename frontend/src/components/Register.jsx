import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

const initialForm = {
  name: "",
  email: "",
  contact: "",
  password: "",
  confirmPassword: "",
  role: "member",

  gymName: "",
  gymLogo: "",
  gymEmail: "",
  gymContact: "",
  whatsapp: "",
  website: "",
  description: "",
  category: "Fitness",
  establishmentYear: "",
  gstNumber: "",

  country: "India",
  state: "",
  city: "",
  area: "",
  fullAddress: "",
  pincode: "",

  facilities: [],

  branches: [
    {
      branchName: "Main Branch",
      managerName: "",
      contact: "",
      address: "",
      city: "",
      pincode: "",
      openingTime: "06:00",
      closingTime: "22:00",
    },
  ],

  gymId: "",
  branchId: "",
};

const facilityOptions = [
  "Cardio",
  "Weight Training",
  "Personal Training",
  "CrossFit",
  "Yoga",
  "Zumba",
  "Steam / Sauna",
  "Locker Facility",
  "Shower Facility",
];

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/auth/gyms")
      .then((data) => setGyms(data.gyms || []))
      .catch(() => setGyms([]));
  }, []);

  const updateField = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateBranch = (index, field, value) => {
    const updated = [...form.branches];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setForm({ ...form, branches: updated });
  };

  const addBranch = () => {
    setForm({
      ...form,
      branches: [
        ...form.branches,
        {
          branchName: "",
          managerName: "",
          contact: "",
          address: "",
          city: "",
          pincode: "",
          openingTime: "06:00",
          closingTime: "22:00",
        },
      ],
    });
  };

  const removeBranch = (index) => {
    if (form.branches.length === 1) return;

    setForm({
      ...form,
      branches: form.branches.filter((_, i) => i !== index),
    });
  };

  const toggleFacility = (facility) => {
    const updated = form.facilities.includes(facility)
      ? form.facilities.filter((item) => item !== facility)
      : [...form.facilities, facility];

    setForm({ ...form, facilities: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.role === "gym_owner") {
      const invalidBranch = form.branches.some(
        (branch) =>
          !branch.branchName.trim() ||
          !branch.contact.trim() ||
          !branch.address.trim()
      );

      if (invalidBranch) {
        setError("Please complete all branch details.");
        return;
      }
    }

    setLoading(true);

    const payload = {
      name: form.name,
      email: form.email,
      contact: form.contact,
      password: form.password,
      role: form.role,
    };

    if (form.role === "gym_owner") {
      Object.assign(payload, {
        gymName: form.gymName,
        gymLogo: form.gymLogo,
        gymEmail: form.gymEmail,
        gymContact: form.gymContact,
        whatsapp: form.whatsapp,
        website: form.website,
        description: form.description,
        category: form.category,
        establishmentYear: form.establishmentYear
          ? Number(form.establishmentYear)
          : null,
        gstNumber: form.gstNumber,

        address: {
          country: form.country,
          state: form.state,
          city: form.city,
          area: form.area,
          fullAddress: form.fullAddress,
          pincode: form.pincode,
        },

        facilities: form.facilities,
        branches: form.branches,
      });
    } else {
      payload.gymId = form.gymId || undefined;
      payload.branchId = form.branchId || undefined;
    }

    try {
      const data = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (form.role === "gym_owner") {
        navigate("/gym/dashboard", {
          state: { message: data.message },
        });
      } else {
        navigate("/member/dashboard");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedGym = gyms.find(
    (gym) => gym._id === form.gymId
  );

  return (
    <div className="auth-page register-page">
      <div className="auth-brand">
        <Link to="/login" className="brand">
          <span className="brand-icon">F</span>
          <span>FLEXORA</span>
          <small>BY FITORA</small>
        </Link>

        <div className="brand-content">
          <span className="eyebrow">BUILT FOR FITNESS. BUILT FOR GROWTH.</span>

          <h1>
            Your journey.
            <br />
            <span>Your platform.</span>
          </h1>

          <p>
            Whether you run a fitness business or want
            to become part of one, Flexora brings
            everything together.
          </p>
        </div>

        <div className="brand-footer">
          © 2026 Flexora by Fitora. All rights reserved.
        </div>
      </div>

      <div className="auth-form-side register-side">
        <div className="mobile-brand brand">
          <span className="brand-icon">F</span>
          FLEXORA
        </div>

        <div className="auth-card register-card">
          <div className="form-heading">
            <span className="form-label">GET STARTED</span>
            <h2>Create your account</h2>
            <p>Choose your account type and enter your details.</p>
          </div>

          <div className="role-selector">
            <button
              type="button"
              className={form.role === "member" ? "role-option selected" : "role-option"}
              onClick={() => {
                setForm({ ...initialForm, role: "member" });
                setError("");
              }}
            >
              <span className="role-icon">♙</span>
              <span>
                <strong>Member</strong>
                <small>Join a fitness community</small>
              </span>
            </button>

            <button
              type="button"
              className={form.role === "gym_owner" ? "role-option selected" : "role-option"}
              onClick={() => {
                setForm({ ...initialForm, role: "gym_owner" });
                setError("");
              }}
            >
              <span className="role-icon">✦</span>
              <span>
                <strong>Gym Owner</strong>
                <small>Manage your gym business</small>
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="section-heading">
              <span>01</span>
              Personal Information
            </div>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={updateField}
                required
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={updateField}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Number *</label>
                <input
                  type="tel"
                  name="contact"
                  placeholder="10-digit number"
                  value={form.contact}
                  onChange={updateField}
                  maxLength={15}
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Password *</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={updateField}
                  minLength={8}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={form.confirmPassword}
                    onChange={updateField}
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
            </div>

            {form.role === "gym_owner" && (
              <>
                <div className="section-heading">
                  <span>02</span>
                  Gym Business Information
                </div>

                <div className="form-group">
                  <label>Gym Name *</label>
                  <input
                    name="gymName"
                    placeholder="Enter your gym business name"
                    value={form.gymName}
                    onChange={updateField}
                    required
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Gym Email *</label>
                    <input
                      type="email"
                      name="gymEmail"
                      placeholder="gym@example.com"
                      value={form.gymEmail}
                      onChange={updateField}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Gym Contact *</label>
                    <input
                      name="gymContact"
                      type="tel"
                      placeholder="Gym contact number"
                      value={form.gymContact}
                      onChange={updateField}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Gym Logo URL</label>
                    <input
                      name="gymLogo"
                      placeholder="https://..."
                      value={form.gymLogo}
                      onChange={updateField}
                    />
                  </div>

                  <div className="form-group">
                    <label>WhatsApp Number</label>
                    <input
                      name="whatsapp"
                      placeholder="WhatsApp number"
                      value={form.whatsapp}
                      onChange={updateField}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Gym Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={updateField}
                    >
                      <option>Fitness</option>
                      <option>CrossFit</option>
                      <option>Strength Training</option>
                      <option>Yoga</option>
                      <option>Mixed Fitness</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Establishment Year</label>
                    <input
                      type="number"
                      name="establishmentYear"
                      placeholder="e.g. 2022"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={form.establishmentYear}
                      onChange={updateField}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Website</label>
                    <input
                      name="website"
                      placeholder="https://yourgym.com"
                      value={form.website}
                      onChange={updateField}
                    />
                  </div>

                  <div className="form-group">
                    <label>GST Number (Optional)</label>
                    <input
                      name="gstNumber"
                      placeholder="Enter GST number"
                      value={form.gstNumber}
                      onChange={updateField}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Gym Description</label>
                  <textarea
                    name="description"
                    placeholder="Tell us about your gym..."
                    value={form.description}
                    onChange={updateField}
                    rows={3}
                  />
                </div>

                <div className="section-heading">
                  <span>03</span>
                  Gym Location
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      name="country"
                      value={form.country}
                      onChange={updateField}
                    />
                  </div>

                  <div className="form-group">
                    <label>State *</label>
                    <input
                      name="state"
                      placeholder="Enter state"
                      value={form.state}
                      onChange={updateField}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      name="city"
                      placeholder="Enter city"
                      value={form.city}
                      onChange={updateField}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Area</label>
                    <input
                      name="area"
                      placeholder="Enter area"
                      value={form.area}
                      onChange={updateField}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      name="pincode"
                      placeholder="Enter pincode"
                      value={form.pincode}
                      onChange={updateField}
                    />
                  </div>

                  <div className="form-group">
                    <label>Full Address *</label>
                    <input
                      name="fullAddress"
                      placeholder="Street, building, landmark"
                      value={form.fullAddress}
                      onChange={updateField}
                      required
                    />
                  </div>
                </div>

                <div className="section-heading">
                  <span>04</span>
                  Gym Facilities
                </div>

                <div className="facility-grid">
                  {facilityOptions.map((facility) => (
                    <label
                      className={`facility-option ${
                        form.facilities.includes(facility) ? "facility-active" : ""
                      }`}
                      key={facility}
                    >
                      <input
                        type="checkbox"
                        checked={form.facilities.includes(facility)}
                        onChange={() => toggleFacility(facility)}
                      />
                      {facility}
                    </label>
                  ))}
                </div>

                <div className="section-heading">
                  <span>05</span>
                  Gym Branches
                </div>

                {form.branches.map((branch, index) => (
                  <div className="branch-card" key={index}>
                    <div className="branch-header">
                      <strong>Branch {index + 1}</strong>

                      {form.branches.length > 1 && (
                        <button
                          type="button"
                          className="remove-branch"
                          onClick={() => removeBranch(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Branch Name *</label>
                      <input
                        placeholder="e.g. Main Branch"
                        value={branch.branchName}
                        onChange={(e) =>
                          updateBranch(index, "branchName", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Branch Contact *</label>
                        <input
                          placeholder="Contact number"
                          value={branch.contact}
                          onChange={(e) =>
                            updateBranch(index, "contact", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Manager Name</label>
                        <input
                          placeholder="Manager name"
                          value={branch.managerName}
                          onChange={(e) =>
                            updateBranch(index, "managerName", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Branch Address *</label>
                      <input
                        placeholder="Complete branch address"
                        value={branch.address}
                        onChange={(e) =>
                          updateBranch(index, "address", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Opening Time</label>
                        <input
                          type="time"
                          value={branch.openingTime}
                          onChange={(e) =>
                            updateBranch(index, "openingTime", e.target.value)
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Closing Time</label>
                        <input
                          type="time"
                          value={branch.closingTime}
                          onChange={(e) =>
                            updateBranch(index, "closingTime", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="add-branch-btn"
                  onClick={addBranch}
                >
                  + Add Another Branch
                </button>
              </>
            )}

            {form.role === "member" && (
              <>
                <div className="section-heading">
                  <span>02</span>
                  Choose Your Gym (Optional)
                </div>

                <div className="form-group">
                  <label>Select Gym</label>
                  <select
                    name="gymId"
                    value={form.gymId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        gymId: e.target.value,
                        branchId: "",
                      })
                    }
                  >
                    <option value="">Join a gym later</option>
                    {gyms.map((gym) => (
                      <option key={gym._id} value={gym._id}>
                        {gym.gymName}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedGym && (
                  <div className="form-group">
                    <label>Select Branch (Optional)</label>
                    <select
                      name="branchId"
                      value={form.branchId}
                      onChange={updateField}
                    >
                      <option value="">Select later</option>
                      {selectedGym.branches.map((branch) => (
                        <option key={branch._id} value={branch._id}>
                          {branch.branchName} - {branch.city}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {error && <div className="error-message">{error}</div>}

            <button className="primary-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
              <span>→</span>
            </button>

            <p className="terms-note">
              By creating an account, you agree to our Terms
              of Service and Privacy Policy.
            </p>
          </form>

          <div className="form-divider">
            <span>ALREADY REGISTERED?</span>
          </div>

          <p className="switch-auth">
            Already have an account?
            <Link to="/login"> Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}