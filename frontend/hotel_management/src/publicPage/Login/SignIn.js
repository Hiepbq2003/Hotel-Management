import React from "react";
import "./Login.css";
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from "react-icons/fa";
import api from "../../api/apiConfig";

// Component nhận prop onLoginSuccess từ Login.js
function SignInForm({ onLoginSuccess }) {
  const [state, setState] = React.useState({ email: "", password: "" });
  const [error, setError] = React.useState(null); 

  const handleChange = (evt) => {
    setState({ ...state, [evt.target.name]: evt.target.value });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    setError(null); // Xóa lỗi cũ

    try {
     
      const loginData = await api.post("/auth/login", {
        email: state.email,
        password: state.password,
      });

      const { token, role } = loginData;
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("email", loginData.email);
      localStorage.setItem("fullName", loginData.fullName);
      localStorage.setItem("phone", loginData.phone);
      if (onLoginSuccess) {
        onLoginSuccess(role);
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      if (err.message) {
        setError(err.message);
      } else {
        setError(
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin và kết nối."
        );
      }
    }

    setState({ email: state.email, password: "" });
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>

        <div className="social-container">
          <a href="#">
            <FaFacebookF />
          </a>
          <a href="#">
            <FaGooglePlusG />
          </a>
          <a href="#">
            <FaLinkedinIn />
          </a>
        </div>

        <span>or use your account</span>

        {/* Hiển thị lỗi */}
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

        <a href="#">Forgot your password?</a>
        <button type="submit" className="sign">
          Sign In
        </button>
      </form>
    </div>
  );
}

export default SignInForm;
