import React, { useState } from 'react';
import api from '../../api/apiConfig';

const ForgotPassword = ({ onSwitchToSignIn }) => {
    const [step, setStep] = useState(1); 
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsLoading(true);

        if (!email) {
            setError("Vui lòng nhập Email.");
            setIsLoading(false);
            return;
        }

        try {
            // Gọi API Backend: POST /api/auth/forgot-password
            await api.post("/auth/forgot-password", { email });

            setMessage("Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.");
            setStep(2); // Chuyển sang bước 2
        } catch (err) {
            console.error("Lỗi gửi OTP:", err);
            // Hiển thị thông báo lỗi chi tiết từ backend hoặc thông báo chung
            const errorMessage = err.response?.data || "Lỗi khi gửi OTP. Vui lòng thử lại.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // ==========================================================
    // BƯỚC 2: Xử lý ĐẶT LẠI MẬT KHẨU
    // ==========================================================
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsLoading(true);

        if (!otp || !newPassword || !confirmPassword) {
            setError("Vui lòng điền đủ Mã OTP và Mật khẩu mới.");
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 6) {
             setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            setIsLoading(false);
            return;
        }

        try {
            // Gọi API Backend: POST /api/auth/reset-password
            await api.post("/auth/reset-password", { 
                email, 
                otp, 
                newPassword 
            });

            setMessage("Đặt lại mật khẩu thành công! Tự động chuyển về Đăng nhập...");
            // Chuyển về trang đăng nhập sau 3 giây
            setTimeout(() => onSwitchToSignIn(), 3000); 

        } catch (err) {
            console.error("Lỗi Reset Mật khẩu:", err);
            // Lỗi 400 Bad Request thường là do OTP hết hạn/sai hoặc email không tồn tại
            const errorMessage = err.response?.data || "Lỗi: Mã OTP không hợp lệ hoặc đã hết hạn.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container sign-in-container">
            <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword}>
                <h1>{step === 1 ? 'Quên Mật Khẩu' : 'Đặt Lại Mật Khẩu'}</h1>
                
                {message && <p style={{ color: "green", margin: "10px 0", fontSize: "14px" }}>{message}</p>}
                {error && <p style={{ color: "red", margin: "10px 0", fontSize: "14px" }}>{error}</p>}
                {isLoading && <p style={{ color: "#007bff", margin: "10px 0", fontSize: "14px" }}>Đang xử lý...</p>}

                {/* Bước 1: Nhập Email */}
                {step === 1 && (
                    <>
                        <span>Nhập email đã đăng ký để nhận mã khôi phục</span>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            disabled={isLoading}
                        />
                        <button type="submit" className="sign" disabled={isLoading}>
                            {isLoading ? 'Đang Gửi...' : 'Gửi Mã OTP'}
                        </button>
                    </>
                )}

                {/* Bước 2: Nhập OTP và Mật khẩu mới */}
                {step === 2 && (
                    <>
                        <span style={{ marginBottom: '10px' }}>Kiểm tra email **{email}** để nhận OTP.</span>
                        <input
                            type="text"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Mã OTP (6 chữ số)"
                            required
                            disabled={isLoading}
                        />
                        <input
                            type="password"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Mật khẩu mới (Tối thiểu 6 ký tự)"
                            required
                            disabled={isLoading}
                        />
                         <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Xác nhận mật khẩu mới"
                            required
                            disabled={isLoading}
                        />
                        <button type="submit" className="sign" disabled={isLoading}>
                            {isLoading ? 'Đang Đặt lại...' : 'Xác nhận & Đặt lại'}
                        </button>
                        <a href="#" onClick={() => { setStep(1); setError(null); setMessage(null); }} 
                           style={{ marginTop: '10px', fontSize: '12px' }}>
                           Gửi lại mã OTP
                        </a>
                    </>
                )}
                
                <a href="#" onClick={onSwitchToSignIn} style={{ marginTop: '20px', color: '#333' }}>
                    Quay lại Đăng nhập
                </a>
            </form>
        </div>
    );
};

export default ForgotPassword;