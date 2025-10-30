package com.project.mhotel.controller;

import com.project.mhotel.dto.ChangePasswordRequest;
import com.project.mhotel.dto.LoginRequest;
import com.project.mhotel.dto.LoginResponse;
import com.project.mhotel.dto.RegisterRequest;
import com.project.mhotel.dto.UpdateProfileRequest; // IMPORT MỚI
import com.project.mhotel.entity.CustomerAccount;
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

    // --- Phương thức Register: Giữ nguyên ---
    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody RegisterRequest registerRequest) {
        try {
            CustomerAccount newCustomer = authService.registerCustomer(registerRequest);

            return ResponseEntity.status(HttpStatus.CREATED).body("Đăng ký tài khoản " + newCustomer.getEmail() + " thành công!");

        } catch (IllegalArgumentException e) {
            // Email đã tồn tại (400 Bad Request)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            // Lỗi server (500 Internal Server Error)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đăng ký thất bại: Đã xảy ra lỗi.");
        }
    }

    // --- Phương thức Change Password: Giữ nguyên ---
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

    // *** PHƯƠNG THỨC MỚI: CẬP NHẬT PROFILE ***
    @PutMapping("/user/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request) {

        // LƯU Ý QUAN TRỌNG:
        // Vì không có SecurityContext (JWT) đầy đủ, ta sẽ GIẢ ĐỊNH EMAIL.
        // TRONG THỰC TẾ, DÒNG NÀY PHẢI ĐƯỢC THAY THẾ BẰNG CƠ CHẾ LẤY EMAIL TỪ TOKEN
        String currentCustomerEmail = "user@example.com";

        try {
            // Thực hiện cập nhật trong Service
            CustomerAccount updatedAccount = authService.updateCustomerProfile(currentCustomerEmail, request);

            // Trả về dữ liệu đã được cập nhật
            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật thông tin thành công!",
                    "fullName", updatedAccount.getFullName(),
                    "phone", updatedAccount.getPhone(),
                    "email", updatedAccount.getEmail()
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Lỗi server khi cập nhật profile."));
        }
    }
}
