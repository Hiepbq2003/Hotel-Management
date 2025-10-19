import React, { useState } from "react";
import styles from "../Login.module.css";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";

export default function Login() {
  const [type, setType] = useState("signIn");

  const handleOnClick = (text) => {
    if (text !== type) setType(text);
  };

  const containerClass = `${styles.container} ${
    type === "signUp" ? styles["right-panel-active"] : ""
  }`;

  return (
    <div className={styles.App}>
      <h1
        style={{
          color: "#ffffff",
          fontSize: "30px",
          fontWeight: "600",
          textAlign: "center",
          margin: "20px 0",
          fontFamily: "'Poppins', sans-serif",
          letterSpacing: "1px",
          textShadow: "2px 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        Discover the Best Experience <br />
        in Our Hotel
      </h1>

      <div className={containerClass}>
        <SignUpForm />
        <SignInForm />
        <div className={styles["overlay-container"]}>
          <div className={styles.overlay}>
            <div className={`${styles["overlay-panel"]} ${styles["overlay-left"]}`}>
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button
                className={styles.ghost}
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className={`${styles["overlay-panel"]} ${styles["overlay-right"]}`}>
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                className={styles.ghost}
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
