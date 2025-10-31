package com.project.mhotel.controller;

import com.project.mhotel.dto.*;
import com.project.mhotel.entity.CustomerAccount;
import com.project.mhotel.entity.UserAccount;
import com.project.mhotel.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateCustomer(@RequestBody LoginRequest loginRequest) {

        Optional<CustomerAccount> authenticatedAccount = authService.authenticateCustomer(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        if (authenticatedAccount.isPresent()) {
            CustomerAccount customer = authenticatedAccount.get();

            String dummyToken = "dummy_token_" + customer.getId();

            LoginResponse response = new LoginResponse(
                    dummyToken,
                    customer.getEmail(),
                    "CUSTOMER",
                    customer.getFullName(),
                    customer.getPhone()
            );

            return ResponseEntity.ok(response);

        } else {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Sai Email hoặc Mật khẩu.");
        }
    }
    @PostMapping("/staff/login")
    public ResponseEntity<?> authenticateStaff(@RequestBody LoginRequest loginRequest) {

        Optional<UserAccount> authenticatedAccount = authService.authenticateUser(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        if (authenticatedAccount.isPresent()) {
            UserAccount user = authenticatedAccount.get();

            String dummyToken = "staff_token_" + user.getId();

            LoginResponse response = new LoginResponse(
                    dummyToken,
                    user.getEmail(),
                    user.getRole().name().toUpperCase(),
                    user.getFullName(),
                    user.getPhone()
            );

            return ResponseEntity.ok(response);

        } else {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Sai Email hoặc Mật khẩu, hoặc tài khoản chưa được kích hoạt.");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody RegisterRequest registerRequest) {
        try {
            CustomerAccount newCustomer = authService.registerCustomer(registerRequest);

            return ResponseEntity.status(HttpStatus.CREATED).body("Đăng ký tài khoản " + newCustomer.getEmail() + " thành công!");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đăng ký thất bại: Đã xảy ra lỗi.");
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {

        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Thiếu thông tin email.");
        }

        try {
            authService.changePassword(request);
            return ResponseEntity.ok("Đổi mật khẩu thành công!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đổi mật khẩu thất bại: Lỗi hệ thống.");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> sendPasswordResetOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Thiếu thông tin email.");
        }

        authService.sendPasswordResetOtp(email);

        return ResponseEntity.ok("Yêu cầu gửi mã OTP đã được xử lý.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        if (request.getEmail() == null || request.getOtp() == null || request.getNewPassword() == null) {
            return ResponseEntity.badRequest().body("Thiếu thông tin OTP, Email, hoặc Mật khẩu mới.");
        }

        try {
            authService.resetPassword(request);
            return ResponseEntity.ok("Đặt lại mật khẩu thành công!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đặt lại mật khẩu thất bại: Lỗi hệ thống.");
        }
    }

    @PutMapping("/user/profile")
    public ResponseEntity<UpdateProfileResponse> updateProfile(@RequestBody UpdateProfileRequest request) {
        String currentCustomerEmail = request.getEmail();
        if (currentCustomerEmail == null || currentCustomerEmail.isEmpty()) {
            return ResponseEntity.badRequest().body(new UpdateProfileResponse("Email không được để trống.", null, null, null));
        }

        try {
            CustomerAccount updatedAccount = authService.updateCustomerProfile(currentCustomerEmail, request);

            UpdateProfileResponse response = new UpdateProfileResponse();
            response.setMessage("Cập nhật thông tin thành công!");
            response.setFullName(updatedAccount.getFullName());
            response.setPhone(updatedAccount.getPhone());
            response.setEmail(updatedAccount.getEmail());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            UpdateProfileResponse errorResponse = new UpdateProfileResponse(e.getMessage(), null, null, null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {

            UpdateProfileResponse errorResponse = new UpdateProfileResponse("Lỗi server khi cập nhật profile.", null, null, null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}