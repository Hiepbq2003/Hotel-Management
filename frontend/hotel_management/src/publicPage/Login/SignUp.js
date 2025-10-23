import React from "react";
import './Login.css';

function SignUpForm() {
  const [state, setState] = React.useState({ name: "", email: "", password: "" });

  const handleChange = (evt) => {
    setState({ ...state, [evt.target.name]: evt.target.value });
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault();
    alert(`You are sign up with name: ${state.name}, email: ${state.email}, and password: ${state.password}`);
    setState({ name: "", email: "", password: "" });
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>

        <div className="social-container">
          <a href="#"><i className="fab fa-facebook-f" /></a>
          <a href="#"><i className="fab fa-google-plus-g" /></a>
          <a href="#"><i className="fab fa-linkedin-in" /></a>
        </div>

        <span>or use your email for registration</span>

        <input type="text" name="name" value={state.name} onChange={handleChange} placeholder="Name" />
        <input type="email" name="email" value={state.email} onChange={handleChange} placeholder="Email" />
        <input type="password" name="password" value={state.password} onChange={handleChange} placeholder="Password" />

        <button type="submit" className="sign">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
