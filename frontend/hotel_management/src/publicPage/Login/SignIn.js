import React from "react";
import './Login.css';

// 1. Import các React Icons cần thiết
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from "react-icons/fa";

function SignInForm() {
  const [state, setState] = React.useState({ email: "", password: "" });

  const handleChange = (evt) => {
    setState({ ...state, [evt.target.name]: evt.target.value });
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault();
    alert(`You are login with email: ${state.email} and password: ${state.password}`);
    setState({ email: "", password: "" });
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>

        <div className="social-container">
          {/* Đã thay thế các thẻ <i> bằng React Icon Components */}
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaGooglePlusG /></a>
          <a href="#"><FaLinkedinIn /></a>
        </div>

        <span>or use your account</span>

        <input type="email" name="email" placeholder="Email" value={state.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={state.password} onChange={handleChange} />

        <a href="#">Forgot your password?</a>
        <button type="submit" className="sign">Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;