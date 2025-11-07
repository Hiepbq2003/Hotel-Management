package com.project.mhotel.service;

import com.project.mhotel.dto.ChangePasswordRequest;
import com.project.mhotel.dto.RegisterRequest;
import com.project.mhotel.dto.ResetPasswordRequest;
import com.project.mhotel.dto.UpdateProfileRequest;
import com.project.mhotel.entity.CustomerAccount;
import com.project.mhotel.entity.CustomerAccount.Status;
import com.project.mhotel.entity.UserAccount;
import com.project.mhotel.repository.CustomerAccountRepository;
import com.project.mhotel.repository.UserAccountRepository;
import com.project.mhotel.utils.EmailUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private EmailUtil emailUtil;

    @Autowired
    private PasswordEncoder passwordEncoder; // <-- Inject PasswordEncoder

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

    // SỬA: Sử dụng PasswordEncoder.matches để so sánh mật khẩu thô và hash
    private boolean isPasswordMatch(String rawPassword, String storedHash) {
        // Dùng PasswordEncoder để so sánh mật khẩu người dùng nhập với mật khẩu đã hash trong DB
        return passwordEncoder.matches(rawPassword, storedHash);
    }

    public Optional<CustomerAccount> authenticateCustomer(String email, String rawPassword) {
        Optional<CustomerAccount> account = customerAccountRepository.findByEmail(email);

        if (account.isPresent()) {
            CustomerAccount customer = account.get();
            // Dùng logic so sánh đã hash
            if (isPasswordMatch(rawPassword, customer.getPasswordHash()) && customer.getStatus() == Status.active) {
                return account;
            }
        }

        return Optional.empty();
    }


    public CustomerAccount registerCustomer(RegisterRequest request) throws IllegalArgumentException {

        if (customerAccountRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã tồn tại.");
        }

        // SỬA: Băm mật khẩu trước khi lưu
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        CustomerAccount newCustomer = CustomerAccount.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone() != null ? request.getPhone() : "")
                .passwordHash(hashedPassword) // <-- Lưu mật khẩu đã băm
                .status(Status.active)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return customerAccountRepository.save(newCustomer);
    }

    public void changePassword(ChangePasswordRequest request) throws IllegalArgumentException {

        CustomerAccount customer = customerAccountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại."));

        // SỬA: Dùng isPasswordMatch để xác thực mật khẩu hiện tại
        if (!isPasswordMatch(request.getCurrentPassword(), customer.getPasswordHash())) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không đúng.");
        }

        // SỬA: Băm mật khẩu mới trước khi lưu
        String newHashedPassword = passwordEncoder.encode(request.getNewPassword());

        customer.setPasswordHash(newHashedPassword); // <-- Lưu mật khẩu đã băm
        customer.setUpdatedAt(LocalDateTime.now());
        customerAccountRepository.save(customer);
    }

    public CustomerAccount updateCustomerProfile(String email, UpdateProfileRequest request) {

        Optional<CustomerAccount> customerOptional = customerAccountRepository.findByEmail(email);

        if (customerOptional.isEmpty()) {
            throw new RuntimeException("Customer not found with email: " + email);
        }

        CustomerAccount customer = customerOptional.get();

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            customer.setFullName(request.getFullName());
        }

        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            customer.setPhone(request.getPhone());
        }

        customer.setUpdatedAt(LocalDateTime.now());

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
        boolean success = emailUtil.sendOTP(email, otp, customer.getFullName());

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

        // SỬA: Băm mật khẩu mới trước khi lưu
        String newHashedPassword = passwordEncoder.encode(request.getNewPassword());

        customer.setPasswordHash(newHashedPassword); // <-- Lưu mật khẩu đã băm
        customer.setUpdatedAt(LocalDateTime.now());
        customerAccountRepository.save(customer);

        otpStorage.remove(request.getEmail());
    }

    public Optional<UserAccount> authenticateUser(String email, String rawPassword) {
        Optional<UserAccount> account = userAccountRepository.findByEmail(email);

        if (account.isPresent()) {
            UserAccount user = account.get();
            // SỬA: Sử dụng isPasswordMatch (đã cập nhật)
            if (isPasswordMatch(rawPassword, user.getPasswordHash()) && user.getStatus() == UserAccount.Status.active) {
                return account;
            }
        }

        return Optional.empty();
    }
}