import React from "react";
import "./Login.css";
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from "react-icons/fa";
import api from "../../api/apiConfig";

function SignInForm({ onLoginSuccess, onForgotPasswordClick }) {
  const [state, setState] = React.useState({ email: "", password: "" });
  const [error, setError] = React.useState(null);

  const handleChange = (evt) => {
    setState({ ...state, [evt.target.name]: evt.target.value });
  };

  const handleLoginSuccess = (loginData) => {
    const { token, role, email, fullName, phone, id } = loginData;
    const finalId = id || "";

    localStorage.setItem("userId", finalId);
    localStorage.setItem("customerId", finalId);
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", role || "");
    localStorage.setItem("email", email);
    localStorage.setItem("fullName", fullName);
    localStorage.setItem("phone", phone || "");

    if (onLoginSuccess) {
      onLoginSuccess(role);
    }
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    setError(null);

    const loginPayload = {
      email: state.email,
      password: state.password,
    };

    try {
      const response = await api.post("/auth/login", loginPayload);
      handleLoginSuccess(response);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (typeof err === "string" ? err : null) ||
        "Login failed. Please check your email and password.";
      setError(errorMessage);
    }

    setState({ ...state, password: "" });
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>

        <div className="social-container">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaGooglePlusG /></a>
          <a href="#"><FaLinkedinIn /></a>
        </div>

        <span>or use your account</span>

        {error && (
          <p style={{ color: "red", margin: "10px 0", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (onForgotPasswordClick) onForgotPasswordClick();
          }}
          style={{ cursor: "pointer", color: "#333" }}
        >
          Forgot your password?
        </a>

        <button type="submit" className="sign">
          Sign In
        </button>
      </form>
    </div>
  );
}

export default SignInForm;