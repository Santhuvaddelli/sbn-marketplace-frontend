import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faWallet, faPercent, faHeadset, faBagShopping, } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Member() {

  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
    designation: "",
    companyWebsite: "",
    location: "",
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const handleRegister = async () => {
    if (!validateRequiredFields()) { return; }
    if (!validateName(form.firstName, "First Name")) { return; }
    if (!validateName(form.lastName, "Last Name")) { return; }
    if (!validateEmail(form.email)) { return; }
    if (!validatePassword(form.password)) { return; }
    if (!validatePhone(form.phone)) { return; }
    try {
      await api.post("/api/register", form);
      toast.success("Registered Successfully");
      navigate("/login");
    }
    catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  }

  // Fields Validation Required Fields Check
  const validateRequiredFields = () => {
    const requiredFields = [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "email", label: "Email Address" },
      { key: "password", label: "Password" },
      { key: "phone", label: "Phone Number" },
      { key: "location", label: "Location" },
      { key: "companyName", label: "Company Name" },
      { key: "designation", label: "Designation" },
    ]
    for (let field of requiredFields) {
      if (!form[field.key] || form[field.key].trim() === "") {
        toast.error(`${field.label} is required`);
        return false;
      }
    }
    return true;
  }

  // Form Data Validation (First Name and Last Name)
  const nameRegEx = /^[A-Za-z\s]+$/;
  const validateName = (value, field) => {
    if (!nameRegEx.test(value)) {
      toast.error(`${field} Must Contain Only Letters`);
      return false;
    }
    return true;
  }

  // Form Data Validation (Email)
  const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validateEmail = (value) => {
    if (!emailRegEx.test(value)) {
      toast.error("Invalid Email");
      return false;
    }
    return true;
  }

  // Form Data Validation (Password)
  const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=]).{8,}$/;
  const validatePassword = (value) => {
    if (!passwordRegEx.test(value)) {
      toast.error("Password must be 8+ chars, include Uppercase, Lowercase, Number & Special character");
      return false;
    }
    return true;
  }

  // Form Data Validation (Phone Number)
  const phoneRegEx = /^[0-9]{10}$/;
  const validatePhone = (value) => {
    if (!phoneRegEx.test(value)) {
      toast.error("Invalid Phone Number");
      return false;
    }
    return true;
  }

  return (
    <div className="member-page">
      <div className="member-banner">
        <img src="MemberBanner.png" alt="Member Banner" />
      </div>

      <div className="top-panel">
        <div className="panel-item">
          <FontAwesomeIcon icon={faUsers} />
          <p>150 SBN Members</p>
        </div>

        <div className="panel-item">
          <FontAwesomeIcon icon={faWallet} />
          <p>7* days secure & regular payments</p>
        </div>

        <div className="panel-item">
          <FontAwesomeIcon icon={faPercent} />
          <p>Low cost of doing business</p>
        </div>

        <div className="panel-item">
          <FontAwesomeIcon icon={faHeadset} />
          <p>One click Seller Support</p>
        </div>

        <div className="panel-item">
          <FontAwesomeIcon icon={faBagShopping} />
          <p>Access to Marketplace</p>
        </div>
      </div>

      {/* Registration Form */}
      <div className="register-section">
        <h2>Become a SBN Member</h2>
        <p className="already">
          Already a member? <Link to="/login">Click Here</Link>
        </p>

        <div className="register-card">
          <div className="form-grid">
            <div>
              <label>First Name *</label>
              <input placeholder="First Name" onChange={handleChange} name="firstName" />
            </div>

            <div>
              <label>Last Name *</label>
              <input placeholder="Last Name" onChange={handleChange} name="lastName" />
            </div>

            <div>
              <label>Email Address *</label>
              <input placeholder="Email Address" onChange={handleChange} name="email" />
            </div>

            <div>
              <label>Password *</label>
              <input placeholder="Password" type="password" onChange={handleChange} name="password" />
            </div>

            <div>
              <label>Phone Number *</label>
              <input placeholder="Phone Number" onChange={handleChange} name="phone" />
            </div>

            <div>
              <label>Location *</label>
              <input placeholder="Location" onChange={handleChange} name="location" />
            </div>

            <div>
              <label>Company Name *</label>
              <input placeholder="Company Name" onChange={handleChange} name="companyName" />
            </div>

            <div>
              <label>Designation *</label>
              <input placeholder="Designation" onChange={handleChange} name="designation" />
            </div>

            <div>
              <label>Company Website</label>
              <input placeholder="Website" onChange={handleChange} name="companyWebsite" />
            </div>

          </div>

          <button className="register-btn" onClick={handleRegister} >Register</button>
        </div>
      </div>
    </div>
  );
}
