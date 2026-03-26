package com.project.mhotel.service;

import com.project.mhotel.dto.ChangePasswordRequest;
import com.project.mhotel.dto.RegisterRequest;
import com.project.mhotel.dto.ResetPasswordRequest;
import com.project.mhotel.dto.UpdateProfileRequest;
import com.project.mhotel.entity.UserAccount;
import com.project.mhotel.entity.UserAccount.Role;
import com.project.mhotel.entity.UserAccount.Status;
import com.project.mhotel.repository.UserAccountRepository;
import com.project.mhotel.utils.EmailUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final EmailUtil emailUtil;
    private final PasswordEncoder passwordEncoder;

    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private static final long OTP_VALIDITY_MINUTES = 5;

    private static class OtpData {
        final String otp;
        final long expiryTime;

        OtpData(String otp) {
            this.otp = otp;
            this.expiryTime = System.currentTimeMillis() + OTP_VALIDITY_MINUTES * 60 * 1000;
        }

        boolean isValid(String providedOtp) {
            return this.otp.equals(providedOtp) && System.currentTimeMillis() < this.expiryTime;
        }
    }

    private boolean isPasswordMatch(String rawPassword, String storedHash) {
        return passwordEncoder.matches(rawPassword, storedHash);
    }

    public Optional<UserAccount> authenticate(String email, String rawPassword) {
        Optional<UserAccount> account = userAccountRepository.findByEmail(email);
        if (account.isPresent()) {
            UserAccount user = account.get();
            if (isPasswordMatch(rawPassword, user.getPasswordHash()) && user.getStatus() == Status.active) {
                return account;
            }
        }
        return Optional.empty();
    }

    public UserAccount registerCustomer(RegisterRequest request) throws IllegalArgumentException {
        if (userAccountRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists.");
        }

        UserAccount newUser = UserAccount.builder()
                .username(request.getEmail())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone() != null ? request.getPhone() : "")
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.customer)
                .status(Status.active)
                .createdAt(LocalDateTime.now())
                .build();

        return userAccountRepository.save(newUser);
    }

    public void changePassword(ChangePasswordRequest request) throws IllegalArgumentException {
        UserAccount user = userAccountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (!isPasswordMatch(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userAccountRepository.save(user);
    }

    public UserAccount updateProfile(String email, UpdateProfileRequest request) {
        UserAccount user = userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            user.setPhone(request.getPhone());
        }

        return userAccountRepository.save(user);
    }

    public boolean sendPasswordResetOtp(String email) {
        UserAccount user = userAccountRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return true;
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStorage.put(email, new OtpData(otp));

        return emailUtil.sendOTP(email, otp, user.getFullName());
    }

    public void resetPassword(ResetPasswordRequest request) throws IllegalArgumentException {
        OtpData otpData = otpStorage.get(request.getEmail());
        if (otpData == null) {
            throw new IllegalArgumentException("Invalid email or OTP.");
        }
        if (!otpData.isValid(request.getOtp())) {
            throw new IllegalArgumentException("OTP is invalid or has expired (5 minutes).");
        }

        UserAccount user = userAccountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userAccountRepository.save(user);
        otpStorage.remove(request.getEmail());
    }

    // Keep for backward compat with AuthController
    public Optional<UserAccount> authenticateUser(String email, String rawPassword) {
        return authenticate(email, rawPassword);
    }
}