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
            setError("Please enter your email address.");
            setIsLoading(false);
            return;
        }

        try {

            await api.post("/auth/forgot-password", { email });

            setMessage("An OTP code has been sent to your email. Please check your inbox.");
            setStep(2); 
        } catch (err) {
            console.error("Error sending OTP:", err);

            const errorMessage = err.response?.data?.message || "Error sending OTP. Please try again.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsLoading(true);

        if (!otp || !newPassword || !confirmPassword) {
            setError("Please fill in the OTP Code and New Password fields.");
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError("The new password must be at least 6 characters long.");
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirmation password do not match.");
            setIsLoading(false);
            return;
        }

        try {

            await api.post("/auth/reset-password", { 
                email, 
                otp, 
                newPassword 
            });

            setMessage("Password reset successful! Redirecting to Sign In...");

            setTimeout(() => onSwitchToSignIn(), 3000); 

        } catch (err) {
            console.error("Error Resetting Password:", err);

            const errorMessage = err.response?.data?.message || "Error: OTP code is invalid or has expired.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwitchToStep1 = () => {
        setStep(1);
        setError(null);
        setMessage(null);
    };

    return (
        <div className="form-container sign-in-container">
            <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword}>
                <h1>{step === 1 ? 'Forgot Password' : 'Reset Password'}</h1>

                {message && <p style={{ color: "green", margin: "10px 0", fontSize: "14px" }}>{message}</p>}
                {error && <p style={{ color: "red", margin: "10px 0", fontSize: "14px" }}>{error}</p>}
                {isLoading && <p style={{ color: "#007bff", margin: "10px 0", fontSize: "14px" }}>Processing...</p>}
                {step === 1 && (
                    <>
                        <span>Enter your registered email to receive the recovery code.</span>
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
                            {isLoading ? 'Sending...' : 'Send OTP Code'}
                        </button>
                    </>
                )}
                {step === 2 && (
                    <>
                        <span style={{ marginBottom: '10px' }}>Check your email **{email}** for the OTP.</span>
                        <input
                            type="text"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="OTP Code (6 digits)"
                            required
                            disabled={isLoading}
                        />
                        <input
                            type="password"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password (Min 6 characters)"
                            required
                            disabled={isLoading}
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm New Password"
                            required
                            disabled={isLoading}
                        />
                        <button type="submit" className="sign" disabled={isLoading}>
                            {isLoading ? 'Resetting...' : 'Confirm & Reset'}
                        </button>

                        <a href="#" onClick={handleSwitchToStep1} 
                            style={{ marginTop: '10px', fontSize: '12px' }}>
                            Resend OTP
                        </a>
                    </>
                )}

                <a href="#" onClick={onSwitchToSignIn} style={{ marginTop: '20px', color: '#333' }}>
                    Back to Sign In
                </a>
            </form>
        </div>
    );
};

export default ForgotPassword;