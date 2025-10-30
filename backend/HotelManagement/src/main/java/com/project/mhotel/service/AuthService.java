package com.project.mhotel.service;

import com.project.mhotel.dto.ChangePasswordRequest;
import com.project.mhotel.dto.RegisterRequest;
import com.project.mhotel.dto.ResetPasswordRequest;
import com.project.mhotel.dto.UpdateProfileRequest;
import com.project.mhotel.entity.CustomerAccount;
import com.project.mhotel.entity.CustomerAccount.Status;
import com.project.mhotel.repository.CustomerAccountRepository;
import com.project.mhotel.utils.EmailUtil; // <--- Cần IMPORT EmailUtil
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    @Autowired
    private CustomerAccountRepository customerAccountRepository;

    @Autowired // <--- THÊM AUTOWIRED để sử dụng EmailUtil
    private EmailUtil emailUtil;

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

    public Optional<CustomerAccount> authenticateCustomer(String email, String rawPassword) {
        Optional<CustomerAccount> account = customerAccountRepository.findByEmail(email);

        if (account.isPresent()) {
            CustomerAccount customer = account.get();
            if (isPasswordMatch(rawPassword, customer.getPasswordHash()) && customer.getStatus() == Status.active) {
                return account;
            }
        }

        return Optional.empty();
    }

    private boolean isPasswordMatch(String rawPassword, String storedHash) {
        return rawPassword.equals(storedHash);
    }

    public CustomerAccount registerCustomer(RegisterRequest request) throws IllegalArgumentException {

        if (customerAccountRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã tồn tại.");
        }

        CustomerAccount newCustomer = CustomerAccount.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone() != null ? request.getPhone() : "")
                .passwordHash(request.getPassword())
                .status(Status.active)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return customerAccountRepository.save(newCustomer);
    }

    public void changePassword(ChangePasswordRequest request) throws IllegalArgumentException {

        CustomerAccount customer = customerAccountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại."));
        if (!isPasswordMatch(request.getCurrentPassword(), customer.getPasswordHash())) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không đúng.");
        }
        customer.setPasswordHash(request.getNewPassword());
        customer.setUpdatedAt(LocalDateTime.now());
        customerAccountRepository.save(customer);
    }

    // *** PHƯƠNG THỨC MỚI: CẬP NHẬT PROFILE ***
    public CustomerAccount updateCustomerProfile(String email, UpdateProfileRequest request) {

        Optional<CustomerAccount> customerOptional = customerAccountRepository.findByEmail(email);

        if (customerOptional.isEmpty()) {
            throw new RuntimeException("Customer not found with email: " + email);
        }

        CustomerAccount customer = customerOptional.get();

        // 1. Cập nhật FullName
        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            customer.setFullName(request.getFullName());
        }

        // 2. Cập nhật Phone
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            customer.setPhone(request.getPhone());
        }

        customer.setUpdatedAt(LocalDateTime.now());

        // 3. Lưu vào cơ sở dữ liệu
        return customerAccountRepository.save(customer);
    }

    public boolean sendPasswordResetOtp(String email) {
        CustomerAccount customer = customerAccountRepository.findByEmail(email)
                .orElse(null);

        if (customer == null) {

            return true;
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStorage.put(email, new OtpData(otp));

        System.out.println("DEBUG: Gửi OTP '" + otp + "' đến email: " + email);
        boolean success = emailUtil.sendOTP(email, otp, customer.getFullName()); // <--- ĐÃ SỬA LỖI TẠI ĐÂY!

        return success;
    }

    public void resetPassword(ResetPasswordRequest request) throws IllegalArgumentException {

        OtpData otpData = otpStorage.get(request.getEmail());

        if (otpData == null) {
            throw new IllegalArgumentException("Email hoặc mã OTP không hợp lệ.");
        }

        if (!otpData.isValid(request.getOtp())) {
            throw new IllegalArgumentException("Mã OTP không hợp lệ hoặc đã hết hạn (5 phút).");
        }

        CustomerAccount customer = customerAccountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại."));

        customer.setPasswordHash(request.getNewPassword());
        customer.setUpdatedAt(LocalDateTime.now());
        customerAccountRepository.save(customer);

        otpStorage.remove(request.getEmail());
    }
}