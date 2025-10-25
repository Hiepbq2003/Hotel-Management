package com.project.mhotel.controller;

import com.project.mhotel.dto.LoginRequest; // Cần tạo DTO này
import com.project.mhotel.dto.LoginResponse; // Cần tạo DTO này
import com.project.mhotel.dto.RegisterRequest;
import com.project.mhotel.entity.CustomerAccount;
import com.project.mhotel.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Hoặc cấu hình CORS cụ thể hơn
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
                    "CUSTOMER"
            );

            return ResponseEntity.ok(response);

        } else {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Sai Email hoặc Mật khẩu.");
        }
    }
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
}