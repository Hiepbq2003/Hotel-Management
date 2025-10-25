import React, { useState } from "react";
// Bắt buộc phải import useNavigate để xử lý chuyển hướng (redirect)
import { useNavigate } from "react-router-dom"; 
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";
import './Login.css'; 

export default function Login() {
    const [type, setType] = useState("signIn");
    const navigate = useNavigate(); // Khởi tạo hook useNavigate

    const handleOnClick = (text) => {
        if (text !== type) setType(text);
    };

    // 1. Hàm xử lý khi Đăng nhập thành công
    // Hàm này sẽ nhận vai trò (role) từ SignIn.js
    const handleLoginSuccess = (role) => {
        // Tùy chỉnh logic chuyển hướng dựa trên vai trò
        if (role === 'MANAGER') {
            navigate('/manager/dashboard');
        } else {
            navigate('/home'); // Chuyển hướng khách hàng về trang chủ
        }
    };

    // 2. Hàm xử lý khi Đăng ký thành công
    // Hàm này sẽ được gọi từ SignUp.js
    const handleRegisterSuccess = () => {
        // Hiển thị thông báo đăng ký thành công
        alert("Đăng ký thành công! Vui lòng Đăng nhập."); 
        // Chuyển đổi trạng thái container sang form Đăng nhập
        setType("signIn"); 
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
                }}>
                Discover the Best Experience <br /> in Our Hotel
            </h1>

            <div className={containerClass} id="container">
                {/* Truyền hàm xử lý vào SignUpForm */}
                <SignUpForm onRegisterSuccess={handleRegisterSuccess} />
                
                {/* Truyền hàm xử lý vào SignInForm */}
                <SignInForm onLoginSuccess={handleLoginSuccess} />
                
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Ready to Explore?</h1>
                            <p>Start your journey with us. Sign up only takes a few seconds!</p>
                            <button className="ghost" id="signIn" onClick={() => handleOnClick("signIn")}>
                                Sign In
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Welcome</h1>
                            <p>Discover and Find your best healing place</p>
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