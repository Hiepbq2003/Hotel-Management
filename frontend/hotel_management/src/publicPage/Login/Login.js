import React, { useState } from "react";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";

export default function Login() {
  const [type, setType] = useState("signIn");
  const handleOnClick = (text) => {
    if (text !== type) setType(text);
  };

  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");

  return (
    <div className="login-page">
      <h1
        style={{
          color: "#ffffff",
          fontSize: "30px",
          fontWeight: "600",
          textAlign: "center",
          margin: "20px 0",
          fontFamily: "'Poppins', sans-serif",
          letterSpacing: "1px",
          textShadow: "2px 2px 8px rgba(0,0,0,0.4)"
        }}
      >
        Discover the Best Experience <br /> in Our Hotel
      </h1>

      <div className={containerClass} id="container">
        <SignUpForm />
        <SignInForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn" onClick={() => handleOnClick("signIn")}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" id="signUp" onClick={() => handleOnClick("signUp")}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
