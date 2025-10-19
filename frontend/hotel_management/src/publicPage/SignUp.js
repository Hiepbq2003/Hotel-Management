import React from "react";
import styles from "../Login.module.css"; // 👈 Import CSS module

function SignUpForm() {
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault();

    const { name, email, password } = state;
    alert(`You are sign up with name: ${name}, email: ${email}, and password: ${password}`);

    // ✅ Reset fields in one go
    setState({ name: "", email: "", password: "" });
  };

  return (
    <div className={`${styles["form-container"]} ${styles["sign-up-container"]}`}>
      <form onSubmit={handleOnSubmit}>
        <h1
          style={{
            color: "#2c3e50",
            fontSize: "36px",
            fontWeight: "700",
            marginBottom: "20px",
          }}
        >
          Create Account
        </h1>

        <div className={styles["social-container"]}>
          <a href="#" className={styles.social}>
            <i className="fab fa-facebook-f" />
          </a>
          <a href="#" className={styles.social}>
            <i className="fab fa-google-plus-g" />
          </a>
          <a href="#" className={styles.social}>
            <i className="fab fa-linkedin-in" />
          </a>
        </div>

        <span>or use your email for registration</span>

        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />

        <button type="submit" className={styles.sign}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
